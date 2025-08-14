// Mock implementation of Core integration functions.

export const UploadFile = async ({ file }) => {
  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock file URL
  return {
    file_url: `https://mock-storage.com/${Date.now()}_${file.name}`
  };
};

export const InvokeLLM = async (prompt) => {
  // Simulate LLM invocation delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return a mock response
  return {
    response: `This is a mock LLM response for the prompt: "${prompt.substring(0, 50)}..."`
  };
};
