import dns from "dns";
import util from "util";

const resolveMxRecords = util.promisify(dns.resolveMx); 


async function verifyEmailDomain(email: string): Promise<boolean> {
    const domain = extractDomain(email);
    return await checkMxRecords(domain);  
}
 

function extractDomain(email: string): string {
    return email.split("@")[1];
} 


async function checkMxRecords(domain: string): Promise<boolean> {  
    try {
        return true;
        const mxRecords = await resolveMxRecords(domain); 
        return mxRecords && mxRecords.length > 0;  
    } catch (error) {
        return false;  
    }
}

export { verifyEmailDomain };