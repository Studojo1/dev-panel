import { auth } from "~/lib/auth";
export async function loader({ request }) {
    return auth.handler(request);
}
export async function action({ request }) {
    return auth.handler(request);
}
