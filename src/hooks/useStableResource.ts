import { createEffect, createSignal } from 'solid-js';

// Keep the last valid value to prevent UI flicker when the resource revalidates (e.g., after delete)
// Rule of DUMB: SolidJS reactivity is just too fast
export function useStableResource<T>(resource: () => T | undefined) {
  const [state, setState] = createSignal<T | undefined>();
  const [loading, setLoading] = createSignal(true);

  createEffect(() => {
    const value = resource();
    if (value) {
      setState(() => value);
      setLoading(() => false);
    } else {
      setLoading(() => true);
    }
  });

  return {
    data: state,
    loading,
  };
}
