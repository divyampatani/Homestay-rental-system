import React, {useState} from 'react';
import {ethers} from 'ethers';
const MetaMask = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setuserBalance] = useState(null);

    const connectWallet = () =>{
        if(window.ethereum){
            window.ethereum.request({method: 'eth_requestAccounts'}).then(result => {
                accountChanged([result[0]])
            })
        } else{
            setErrorMessage('Install MetaMask please')
        }
    }
    const accountChanged = (accountName) => {
        setDefaultAccount(accountName);
        // getUserBalance(accountName);
    }

    // const getUserBalance = (accountAddress) => {
    //     window.ethereum.request({method: 'eth_getBalance', params: [String(accountAddress), "latest"]}).then(
    //         balance => {
    //             setuserBalance(ethers.utils.formatEther(balance));
    //         }
    //     )
    // }
    async function sendTransaction(){
        let params = [{
            from:"0x0A17dFDf1c7a3E9a1d933F459d399383d2150fe5",
            to: "0x7e070b6EECeB705ba99E13a8bd83938a95a91C4B",
            gas: Number(21000).toString(16),
            gasPrice: Number(587228555).toString(16),
            value: Number(10000000000000000).toString(16),
        }]

        let result = await window.ethereum.request({method: "eth_sendTransaction", params}).catch((err) => {
            console.log(err)
        })
    }
  return (
    <div>
        <h1>MetaMask Wallet Connection</h1>
        <center>
        <button onClick={connectWallet}> Connect Wallet Button</button>
        {/* {alert("address: "+ {defaultAccount})}
        {alert("Balance: $")} */}
        <h3>Address: {defaultAccount}</h3>
        {/* <h3>Balance: {userBalance}</h3> */}
        {errorMessage}
        <form onSubmit={sendTransaction}>
            <input type="submit" value="Submit" />
        </form>
        </center>
    </div>
  )
}

export default MetaMask;