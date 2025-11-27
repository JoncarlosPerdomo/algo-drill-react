
// Define types for the messages
export interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export interface WorkerMessage {
  code: string;
  fnName: string;
  testCases: { input: any; expected: any }[];
}

export interface WorkerResponse {
  results?: TestResult[];
  error?: string;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { code, fnName, testCases } = e.data;

  try {
    // Create the function from the code
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const createFn = new Function(`${code}; return ${fnName};`);
    const userFn = createFn();

    const results: TestResult[] = testCases.map((tc) => {
      try {
        // Clone input to prevent mutation side effects
        const inputClone = JSON.parse(JSON.stringify(tc.input));
        
        // Execute the function
        const result = userFn(...inputClone);
        
        // Handle void returns for in-place modifications
        const actual = result === undefined ? inputClone[0] : result;
        
        const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
        
        return {
          input: JSON.stringify(tc.input),
          expected: JSON.stringify(tc.expected),
          actual: JSON.stringify(actual),
          passed,
        };
      } catch (err: any) {
        return {
          input: JSON.stringify(tc.input),
          expected: JSON.stringify(tc.expected),
          actual: 'Error',
          passed: false,
          error: err.message,
        };
      }
    });

    self.postMessage({ results });
  } catch (err: any) {
    self.postMessage({ error: err.message });
  }
};
