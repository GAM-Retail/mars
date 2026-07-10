export function catchResult(err: unknown) {
  return {
    success: false,
    message: err instanceof Error ? err.message : 'An unexpected error occurred',
  };
}
