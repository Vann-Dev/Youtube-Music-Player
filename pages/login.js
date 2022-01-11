const axios = require('axios').default;
import Cookies from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script'

export default function Login() {
    const router = useRouter()

    async function loginAccount() {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        if (!username) {
            document.getElementById('usernameLost').classList.remove('hidden')
            setTimeout(() => {
                document.getElementById('usernameLost').classList.add('hidden')
            }, 5000);
            return
        }

        if (!password) {
            document.getElementById('passwordLost').classList.remove('hidden')
            setTimeout(() => {
                document.getElementById('passwordLost').classList.add('hidden')
            }, 5000);
            return
        }

        document.getElementById("loginButton").disabled = true;
        document.getElementById("loginButton").classList.toggle('cursor-wait')
        axios.get(`https://forlorn-rifle-production.up.railway.app/loginAccount/${username}/${password}`).then(x => {
            Cookies.set('TOKEN', x.data.data.token)
            document.getElementById("loginButton").disabled = false;
            document.getElementById("loginButton").classList.toggle('cursor-wait')
            router.push('/')
        }).catch(() => {
            document.querySelectorAll('.wrong').forEach(x => x.classList.remove('hidden'))
            setTimeout(() => {
                document.querySelectorAll('.wrong').forEach(x => x.classList.add('hidden'))
            }, 5000);
            document.getElementById("loginButton").disabled = false;
            document.getElementById("loginButton").classList.toggle('cursor-wait')
        })
    }

    return (
        <>
            <Script src="https://kit.fontawesome.com/c6b3c624ab.js" crossOrigin="anonymous"></Script>
            <div className="h-screen w-screen flex justify-center items-center">
                <div className="border-2 border-gray-300 py-10 px-7 rounded-xl z-50">
                    <div>
                        <h1 className="text-gray-200 text-center text-xl md:text-3xl underline-offset-4 font-mono underline decoration-indigo-500">Login</h1>
                        <div className="flex flex-col mt-10 gap-5">
                            <div>
                                <p className="text-gray-200 md:text-2xl">Username</p>
                                <input autoComplete='off' id='username' placeholder="Type your username" className="bg-transparent mt-1 md:text-2xl focus:!outline-none placeholder-gray-200/70 text-gray-200 border-dashed border-b-[1px] border-gray-200"></input>
                                <p className="text-red-500/75 wrong mt-2 text-xs hidden">Wrong Password or Username ?</p>
                                <p id='usernameLost' className="text-red-500/75 mt-2 text-xs hidden">Please input Username</p>
                            </div>
                            <div>
                                <p className="text-gray-200 md:text-2xl">Password</p>
                                <input id='password' autoComplete='off' type={'password'} placeholder="Type your password" className="bg-transparent mt-1 md:text-2xl focus:!outline-none placeholder-gray-200/70 text-gray-200 border-dashed border-b-[1px] border-gray-200"></input>
                                <p className="text-red-500/75 wrong mt-2 text-xs hidden">Wrong Password or Username ?</p>
                                <p id='passwordLost' className="text-red-500/75 mt-2 text-xs hidden">Please input Password</p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 mt-5">
                                <button id='loginButton' onClick={loginAccount} className="bg-indigo-700 hover:opacity-70 px-4 py-3 md:text-3xl rounded-xl grow mt-5 md:mt-0 text-gray-200">LOGIN</button>
                                <Link href={'/register'} passHref><button className="border-indigo-700 hover:opacity-70 border-2 px-4 py-3 md:text-3xl grow rounded-xl text-gray-200">REGISTER</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}