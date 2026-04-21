type ActionResponse<T> =
  | {
      status: 'success';
      data: T;
    }
  | {
      status: 'error';
      message: string;
    };
export default ActionResponse;
