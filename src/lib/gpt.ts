import { HfInference } from '@huggingface/inference';

// Create Hugging Face inference instance
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "mistralai/Mistral-7B-Instruct-v0.2",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
): Promise<
  {
    question: string;
    answer: string;
  }[]
> {
  // if the user input is in a list, we also process the output as a list of json
  const list_input: boolean = Array.isArray(user_prompt);
  // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  // start off with no error message
  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
      output_format
    )}. \nIMPORTANT: Follow these strict JSON formatting rules:
1. All property names must be in double quotes
2. All string values must be in double quotes
3. Use proper JSON syntax with colons between property names and values
4. Separate multiple objects with commas
5. Wrap the entire response in square brackets for an array
6. Do not use single quotes or escape characters
7. IMPORTANT: All string values containing quotes must have those quotes ESCAPED with backslashes. For example: "answer": "The keyword \\"function\\" is used in C++".
8. Example format:
[
  {
    "question": "What is 2+2?",
    "answer": "4",
    "option1": "3",
    "option2": "5",
    "option3": "6"
  }
]`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    // if output_format contains dynamic elements, process it accordingly
    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    // if input is in a list format, ask it to generate json in a list
    if (list_input) {
      output_format_prompt += `\nGenerate a list of json, one json for each input element.`;
    }

    try {
      // Construct the messages array for the text generation API
      const messages = [
        { role: "system", content: system_prompt + output_format_prompt + error_msg },
        { role: "user", content: user_prompt.toString() }
      ];

      // Use Hugging Face's text generation API
      const response = await hf.textGeneration({
        model: model,
        inputs: messages.map(msg => `${msg.role}: ${msg.content}`).join('\n'),
        parameters: {
          temperature: temperature,
          max_new_tokens: 1024,
          return_full_text: false,
        }
      });

      let res: string = response.generated_text ?? "";

      if (verbose) {
        console.log("Raw response:", res);
      }

      // Clean and parse the response
      const cleanedResponse = cleanJsonResponse(res);
      
      if (verbose) {
        console.log("Cleaned response:", cleanedResponse);
      }

      let output: any;
      try {
        output = JSON.parse(cleanedResponse);
      } catch (parseError) {
        if (verbose) {
          console.error("Parse error:", parseError);
          console.error("Failed to parse:", cleanedResponse);
        }
        
        if (i < num_tries - 1) {
          error_msg = `\n\nPrevious response was invalid JSON. Please ensure you return a properly formatted JSON array with escaped quotes. Example: [{"question": "What is a \\"pointer\\" in C++?", "answer": "A \\"pointer\\" is a variable that stores the memory address of another variable."}]`;
          continue;
        }
        throw new Error("Failed to parse JSON after all attempts");
      }

      // Ensure output is always an array
      if (!Array.isArray(output)) {
        output = [output];
      }

      // Check for each element in the output_list, the format is correctly adhered to
      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          // Unable to ensure accuracy of dynamic output header, so skip it
          if (/<.*?>/.test(key)) {
            continue;
          }

          // If output field missing, raise an error
          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          // Check that one of the choices given for the list of words is an unknown
          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            // Ensure output is not a list
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            // Output the default category (if any) if model is unable to identify the category
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            // If the output is a description format, get only the label
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        // If we just want the values for the outputs
        if (output_value_only) {
          output[index] = Object.values(output[index]);
          // Just output without the list if there is only one element
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      if (i < num_tries - 1) {
        error_msg = `\n\nResult: Failed to parse the response. Error message: ${e}`;
        if (verbose) {
          console.log("An exception occurred:", e);
        }
      } else {
        console.error("All attempts failed. Last error:", e);
        return [];
      }
    }
  }

  return [];
}

// Enhanced function to better handle and clean JSON responses from LLMs
function cleanJsonResponse(text: string): string {
  // Helper to validate if string is valid JSON
  const isValidJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  // Helper to extract JSON content with validation
  const extractJsonContent = (input: string): string => {
    // Try to find complete JSON array first
    const patterns = [
      /\[\s*{\s*"[^"]+"\s*:[\s\S]*}\s*\]/,  // Array of objects
      /{[\s\S]*}/,                           // Single object
      /\[[\s\S]*\]/                          // Array
    ];

    for (const pattern of patterns) {
      const matches = input.match(pattern);
      if (matches) {
        const extracted = matches[0];
        if (isValidJson(extracted)) {
          return extracted;
        }
      }
    }

    // If no valid JSON found, return the input for further processing
    return input;
  };

  // Step 1: Basic cleanup
  let cleaned = text
    .replace(/^[^[{]*/, '')  // Remove any text before first [ or {
    .replace(/[}\]]\s*$/, match => match[0]); // Keep only the first closing bracket/brace

  // Step 2: Extract what looks like JSON
  cleaned = extractJsonContent(cleaned);

  // Step 3: Fix common JSON issues
  const fixJson = (input: string): string => {
    return input
      // Fix property names
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
      // Fix unquoted or single-quoted values
      .replace(/:\s*'([^']+)'/g, ':"$1"')
      .replace(/:\s*([^",{\[\s][^,}\]]*?)([,}\]])/g, ':"$1"$2')
      // Fix escaped quotes
      .replace(/\\*"/g, match => match.length % 2 ? match : '\\"')
      // Fix common structural issues
      .replace(/,(\s*[}\]])/g, '$1')
      .replace(/}(\s*){/g, '},{')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Step 4: Apply fixes and validate
  cleaned = fixJson(cleaned);
  
  // Step 5: If still not valid, try more aggressive fixing
  if (!isValidJson(cleaned)) {
    // Try to fix nested quotes
    cleaned = cleaned.replace(/(?<=[:\s]\s*"[^"]*)"(?=[^"]*"[,}])/g, '\\"');
    
    // Try to fix any remaining issues
    if (!isValidJson(cleaned)) {
      cleaned = cleaned
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')  // Remove control characters
        .replace(/([^\\])"/g, '$1\\"')          // Escape all unescaped quotes
        .replace(/^([^"])/g, '"$1')             // Ensure string starts with quote
        .replace(/([^"])$/g, '$1"')             // Ensure string ends with quote
        .replace(/^\\"/, '"')                   // Fix first quote if escaped
        .replace(/\\"$/, '"');                  // Fix last quote if escaped
    }
  }

  return cleaned;
}