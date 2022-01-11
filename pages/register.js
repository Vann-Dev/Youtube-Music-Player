import Cookies from 'js-cookie';
const axios = require('axios').default;
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter()

    async function createAccount() {
        const username = document.getElementById('username').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const passwordAgain = document.getElementById('passwordAgain').value

        if (!username) return toggleWarn('usernameLost')

        if (!/^([a-zA-Z0-9 _-]+)$/.test(username)) return toggleWarn('invalidUsername')

        if (!email) return toggleWarn('emailLost')

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) return toggleWarn('invalidEmail')

        if (!password) return toggleWarn('passwordLost')

        if (!passwordAgain) return toggleWarn('passwordAgainLost')

        if (password != passwordAgain) {
            document.querySelectorAll('.wrong').forEach(x => x.classList.remove('hidden'))
            setTimeout(() => {
                document.querySelectorAll('.wrong').forEach(x => x.classList.add('hidden'))
            }, 5000);
            return;
        }

        const data = {
            "email": email,
            "username": username,
            "password": password
        }

        document.getElementById("createButton").disabled = true;
        document.getElementById("createButton").classList.toggle('cursor-wait')

        axios.post('https://forlorn-rifle-production.up.railway.app/registerAccount', data).then(x => {
            document.getElementById("createButton").disabled = false;
            document.getElementById("createButton").classList.toggle('cursor-wait')
            Cookies.set('TOKEN', x.data.data.token)
            router.push('/')
        }).catch(() => {
            toggleWarn('usernameExist')
            document.getElementById("createButton").disabled = false;
            document.getElementById("createButton").classList.toggle('cursor-wait')
        })
    }

    function toggleWarn(id) {
        document.getElementById(id).classList.remove('hidden')
        setTimeout(() => {
            document.getElementById(id).classList.add('hidden')
        }, 5000);
        return
    }

    return (
        <>
            <div className="h-screen w-screen flex justify-center items-center">
                <div className="border-2 border-gray-300 py-10 px-7 rounded-xl z-50">
                    <div>
                        <h1 className="text-gray-200 text-center text-xl md:text-3xl underline-offset-4 font-mono underline decoration-indigo-500">Register</h1>
                        <div className="grid md:grid-cols-2 mt-10 gap-5">
                            <div>
                                <p className="text-gray-200 md:text-2xl">Username</p>
                                <input autoComplete='off' id='username' placeholder="Type your username" className="bg-transparent mt-1 md:text-2xl focus:!outline-none placeholder-gray-200/70 text-gray-200 border-dashed border-b-[1px] border-gray-200"></input>
                                <p id='invalidUsername' className="text-red-500/75 mt-2 text-xs hidden">Invalid Username</p>
                                <p id='usernameExist' className="text-red-500/75 mt-2 text-xs hidden">Username already exist</p>
                                <p id='usernameLost' className="text-red-500/75 mt-2 text-xs hidden">Please input Username</p>
                            </div>
                            <div>
                                <p className="text-gray-200 md:text-2xl">Email</p>
                                <input id='email' autoComplete='off' type={'email'} placeholder="Type your password" className="bg-transparent mt-1 md:text-2xl focus:!outline-none placeholder-gray-200/70 text-gray-200 border-dashed border-b-[1px] border-gray-200"></input>
                                <p id='emailLost' className="text-red-500/75 mt-2 text-xs hidden">Please input Email</p>
                                <p id='invalidEmail' className="text-red-500/75 mt-2 text-xs hidden">Invalid Email</p>
                            </div>
                            <div className='md:mt-10'>
                                <p className="text-gray-200 md:text-2xl">Password</p>
                                <input id='password' autoComplete='off' type={'password'} placeholder="Type your password" className="bg-transparent mt-1 md:text-2xl focus:!outline-none placeholder-gray-200/70 text-gray-200 border-dashed border-b-[1px] border-gray-200"></input>
                                <p className="text-red-500/75 wrong mt-2 text-xs hidden">Password must be same</p>
                                <p id='passwordLost' className="text-red-500/75 mt-2 text-xs hidden">Please input Password</p>
                            </div>
                            <div className='md:mt-10'>
                                <p className="text-gray-200 md:text-2xl">Type password again</p>
                                <input id='passwordAgain' autoComplete='off' type={'password'} placeholder="Type your password" className="bg-transparent mt-1 md:text-2xl focus:!outline-none placeholder-gray-200/70 text-gray-200 border-dashed border-b-[1px] border-gray-200"></input>
                                <p className="text-red-500/75 wrong mt-2 text-xs hidden">Password must be same</p>
                                <p id='passwordAgainLost' className="text-red-500/75 mt-2 text-xs hidden">Please input Password again</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center gap-6 md:mt-10">
                            <button id='createButton' onClick={createAccount} className="bg-indigo-700 hover:opacity-70 px-4 py-3 md:text-3xl rounded-xl grow mt-5 md:mt-0 text-gray-200">CREATE</button>
                            <Link href={'/login'} passHref><button className="border-indigo-700 hover:opacity-70 border-2 px-4 py-3 md:text-3xl grow rounded-xl text-gray-200">LOGIN</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}