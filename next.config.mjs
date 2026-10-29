const simulator=process.env.SIMULATOR_ORIGIN??'http://127.0.0.1:3001';
const onboarding=process.env.ONBOARDING_ORIGIN??'http://127.0.0.1:3002';
/** @type {import('next').NextConfig} */
export default {async rewrites(){return [
 {source:'/simulator/:path*',destination:`${simulator}/simulator/:path*`},
 {source:'/simulator-static/:path*',destination:`${simulator}/simulator-static/:path*`},
 {source:'/onboarding/:path*',destination:`${onboarding}/onboarding/:path*`},
 {source:'/onboarding-static/:path*',destination:`${onboarding}/onboarding-static/:path*`}
];}};
