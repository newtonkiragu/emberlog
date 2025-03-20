export async function updateUserName(name: string) {
    const response = await fetch("/api/settings/update-name", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name}),
    });

    return response.json();
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
    const response = await fetch("/api/settings/update-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({currentPassword, newPassword}),
    });

    return response.json();
}
