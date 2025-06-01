/**
 * Loads initials in sidebar.
 */
async function initHelp() {
    await getCurrentUserIdFromSessionStorage();
    await setUserInitialsAtHeader();
}