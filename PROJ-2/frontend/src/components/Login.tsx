import '../styles/Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // State for input values and messages
  const [message, setMessage] = React.useState('');
  const [loginName, setLoginName] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const navigate = useNavigate();

  // OLD ~~~~ Navigate to login page
  /*function doLogin(): void {
    navigate('/studySets');
  }*/

  // Check if valid user then navigate to study set page
  async function doLogin(event: any) : Promise < void > {
  event.preventDefault();
  var obj = {
    login: loginName,
    password: loginPassword
  };
  var js = JSON.stringify(obj);
    console.log(js);
  try {
    const response = await fetch('https://project.annetteisabrunette.xyz/api/login', {
      method: 'POST',
      body: js,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    var res = JSON.parse(await response.text());
    console.log(res);
    if (res.id < 0) {
      setMessage('User/Password combination incorrect');
    } else {
      var user = {
        firstName: res.username,
        id: res.id
      }
      localStorage.setItem('user_data', JSON.stringify(user));
      setMessage('');
      window.location.href = '/HomePage';
    }
  } catch(error: any) {
    alert(error.toString());
    return;
  }
};

  function handleSetLoginName(e: React.ChangeEvent<HTMLInputElement>): void {
    setLoginName(e.target.value);
  }

  function handleSetPassword(e: React.ChangeEvent<HTMLInputElement>): void {
    setLoginPassword(e.target.value);
  }

  function doCreateAccount(): void {
    navigate('/newAccount');
  }

  return (
    <div className="center-text">
      <div className="small-square">
        <div className="center-text">
          <br />
          <br />
          <span className="large-text">PLEASE LOGIN</span>
          <br />
          <br />
          <input
            className="input-bar"
            type="text"
            id="loginName"
            placeholder="Username"
            value={loginName}
            onChange={handleSetLoginName}
          />
          <input
            className="input-bar"
            type="password"
            id="loginPassword"
            placeholder="Password"
            value={loginPassword}
            onChange={handleSetPassword}
          />
          <button className="purple-buttons" onClick={doLogin}>
            LOGIN
          </button>
          <button className="blue-buttons" onClick={doCreateAccount}>
            SIGN UP
          </button>
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
