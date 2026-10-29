import {command,completed,ready,stop} from './processes.mjs';
const mode=process.argv[2];
if(!['dev','start'].includes(mode))throw new Error('Modo esperado: dev o start');
const children=[];let stopping=false;
function cleanup(code=0){if(stopping)return;stopping=true;for(const child of [...children].reverse())stop(child);process.exit(code);}
process.on('SIGINT',()=>cleanup());process.on('SIGTERM',()=>cleanup());
function launch(args){const child=command(args);children.push(child);child.on('error',e=>{console.error(e);cleanup(1);});child.on('exit',code=>{if(!stopping){console.error('Un servicio se detuvo:',code);cleanup(code||1);}});return child;}
try{
 if(mode==='dev')await completed(command(['run','build','--workspace','@brote/contracts']));
 launch(['run',mode,'--workspace','@brote/api']);
 await ready(`${process.env.API_ORIGIN??'http://127.0.0.1:4000'}/v1/health`);
 launch(['run',mode,'--workspace','@brote/simulator']);
 launch(['run',mode,'--workspace','@brote/onboarding']);
 await Promise.all([ready('http://127.0.0.1:3001/simulator'),ready('http://127.0.0.1:3002/onboarding')]);
 launch(['run',`${mode}:shell`]);
 await ready('http://127.0.0.1:3000/products');
 console.log('\nBROTE LISTO: http://127.0.0.1:3000/products\nAPI: http://127.0.0.1:4000/v1/health\nCtrl+C detiene los cuatro procesos.');
}catch(error){console.error(error);cleanup(1);}
