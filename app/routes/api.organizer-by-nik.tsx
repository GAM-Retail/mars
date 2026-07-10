import { data, type LoaderFunctionArgs } from 'react-router';
import { getOrganizerByNikController } from '~/lib/services/organizer.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const organizer = await getOrganizerByNikController(request, params.nik ?? '');
  return data(organizer);
}
