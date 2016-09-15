/** An object mapping the flat color palette to its hex codes. */
export const flatColor = {
  turquoise: '#1ABC9C',
  greenSea: '#16A085',
  emerald: '#2ECC71',
  nephritis: '#27AE60',
  peterRiver: '#3498DB',
  belizeHole: '#2980B9',
  amethyst: '#9B59B6',
  wisteria: '#8E44AD',
  wetAsphalt: '#34495E',
  midnightBlue: '#2C3E50',
  sunFlower: '#F1C40F',
  orange: '#F39C12',
  carrot: '#E67E22',
  pumpkin: '#D35400',
  alizarin: '#E74C3C',
  pomegranate: '#C0392B',
  clouds: '#ECF0F1',
  silver: '#BDC3C7',
  concrete: '#95A5A6',
  asbestos: '#7F8C8D',
};

let sbcRip;

/**
 * Applies a shade to a color.
 *
 * @param {Number} p A negative or positive float with the amound of shade to apply.
 * @param {String} from The original color in full Hex format (eg. #00FF00).
 * @param {String} to If provided, this and the `from` color will be blend.
 * @author Pimp Trizkit <http://stackoverflow.com/a/13542669/396002>
 */
export function shadeBlendConvert(p, from, to) {
  /* eslint-disable */
  if(typeof(p)!="number"||p<-1||p>1||typeof(from)!="string"||(from[0]!='r'&&from[0]!='#')||(typeof(to)!="string"&&typeof(to)!="undefined"))return null; //ErrorCheck
  if(!sbcRip)sbcRip=function(d){
    var l=d.length,RGB=new Object();
    if(l>9){
      d=d.split(",");
      if(d.length<3||d.length>4)return null;//ErrorCheck
      RGB[0]=i(d[0].slice(4)),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
    }else{
      if(l==8||l==6||l<4)return null; //ErrorCheck
      if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 digit
      d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=l==9||l==5?r(((d>>24&255)/255)*10000)/10000:-1;
    }
    return RGB;}
  var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=sbcRip(from),t=sbcRip(to);
  if(!f||!t)return null; //ErrorCheck
  if(h)return "rgb("+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
  else return "#"+(0x100000000+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)*0x1000000+r((t[0]-f[0])*p+f[0])*0x10000+r((t[1]-f[1])*p+f[1])*0x100+r((t[2]-f[2])*p+f[2])).toString(16).slice(f[3]>-1||t[3]>-1?1:3);
}

/**
 * Checks ehether a string represents a valid css hex color or rgb[a]? function.
 *
 * This function needs improvement. Its not very reliable as of now.
 *
 * @param  {String} colorStr The color string.
 * @return {Boolean} Whether the string represents a valid css hex color or rgb[a]? function.
 */
export function isCssColor(colorStr) {
  /* eslint-disable max-len */
  const pattern = /(#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}))|(rgb\(\s*([0-9]{0,3}\s*,\s*){2}([0-9]{0,3})\s*\)|(rgba\(\s*([0-9]{0,3}\s*,\s*){3}([0-1](\.[0-9]+))\s*\)))/;
  return pattern.test(colorStr);
}
