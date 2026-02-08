/**
 * Check if the current user has dev or admin role
 * This calls the control plane API to verify the user's role
 */
export async function checkDevRole() {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { hasAccess: false };
        }
        const controlPlaneUrl = import.meta.env.VITE_CONTROL_PLANE_URL || "https://api.studojo.com";
        const response = await fetch(`${controlPlaneUrl}/v1/dev/services`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            // If the request succeeds, user has dev or admin access
            // Try to get the role from the check-role endpoint
            const roleResponse = await fetch(`${window.location.origin}/api/auth/check-role`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (roleResponse.ok) {
                const data = await roleResponse.json();
                return { hasAccess: true, role: data.role };
            }
            return { hasAccess: true };
        }
        return { hasAccess: false };
    }
    catch (error) {
        console.error("Error checking dev role:", error);
        return { hasAccess: false };
    }
}
/**
 * Get auth token from Better Auth
 */
async function getAuthToken() {
    try {
        const { authClient } = await import("./auth-client");
        const { data } = await authClient.token();
        return data?.token || null;
    }
    catch (error) {
        console.error("Error getting auth token:", error);
        return null;
    }
}
