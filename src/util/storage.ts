/**
 * Loads JMP-related data from extension storage
 */
export const getStoredData = async (): Promise<JumpStorage | null> => {
	const data = await browser.storage.sync.get('jmp');
	return data.jmp || null;
};

interface JumpStorage {
	url?: string | null;
}