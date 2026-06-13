import { LOCATION } from '../config.js';

/* ── SunCalc (compact) ────────────────────────────── */
const RAD=Math.PI/180,DAY_MS=864e5,J1970=2440588,J2000=2451545;
const toJulian=d=>d.valueOf()/DAY_MS-.5+J1970,fromJulian=j=>new Date((j+.5-J1970)*DAY_MS),toDays=d=>toJulian(d)-J2000;
const EOBL=RAD*23.4397,sMA=d=>RAD*(357.5291+.98560028*d);
const eLon=M=>M+RAD*(1.9148*Math.sin(M)+.02*Math.sin(2*M)+.0003*Math.sin(3*M))+RAD*102.9372+Math.PI;
const decl=l=>Math.asin(Math.sin(EOBL)*Math.sin(l));
const jCycle=(d,lw)=>Math.round(d-.0009-lw/(2*Math.PI));
const appTrans=(Ht,lw,n)=>.0009+(Ht+lw)/(2*Math.PI)+n;
const solTransJ=(ds,M,L)=>J2000+ds+.0053*Math.sin(M)-.0069*Math.sin(2*L);
const hourAngle=(h,phi,d)=>Math.acos((Math.sin(h)-Math.sin(phi)*Math.sin(d))/(Math.cos(phi)*Math.cos(d)));

export function sunTimes(date,lat,lng){
  const lw=RAD*-lng,phi=RAD*lat,d=toDays(date);
  const n=jCycle(d,lw),ds=appTrans(0,lw,n),M=sMA(ds),L=eLon(M),dec=decl(L);
  const Jnoon=solTransJ(ds,M,L),w=hourAngle(-.833*RAD,phi,dec);
  const Jset=solTransJ(appTrans(w,lw,n),M,L),Jrise=Jnoon-(Jset-Jnoon);
  return{sunrise:fromJulian(Jrise),sunset:fromJulian(Jset)};
}
export function autoIsDark() {
  try { const{sunrise,sunset}=sunTimes(new Date(),LOCATION.lat,LOCATION.lng); const now=Date.now(); return now>=sunset.getTime()||now<sunrise.getTime(); }
  catch{return false;}
}
