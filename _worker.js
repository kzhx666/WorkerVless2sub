let 快速订阅访问入口 = ['auto'];
let addresses = [];
let addressesapi = [];

let addressesnotls = [];
let addressesnotlsapi = [];

let addressescsv = [];
let DLS = 7;
let remarkIndex = 1;//CSV备注所在列偏移量

// 修改：更换了更稳定的默认订阅转换后端，防止522超时
let subConverter = 'api.v1.mk';
let subConfig = atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2NtbGl1L0FDTDRTU1IvbWFpbi9DbGFzaC9jb25maWcvQUNMNFNTUl9PbmxpbmVfRnVsbF9NdWx0aU1vZGUuaW5p');
let subProtocol = 'https';
let noTLS = 'false';
let link;
let 隧道版本作者 = atob('ZWQ=');
let 获取代理IP;
let proxyIPs = [
	atob('cHJveHlpcC5meHhrLmRlZHluLmlv'),
];
let 匹配PROXYIP = [];
let socks5DataURL = '';
let BotToken = '';
let ChatID = '';
let 临时中转域名 = [];
let 临时中转域名接口 = '';
let EndPS = '';
let 协议类型 = atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`);
let FileName = '优选订阅生成器';
let SUBUpdateTime = 6;
let total = 24;
let timestamp = 4102329600000;
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
let fakeUserID;
let fakeHostName;
let httpsPorts = ["2053", "2083", "2087", "2096", "8443"];
let 有效时间 = 7;
let 更新时间 = 3;
let MamaJustKilledAMan = ['telegram', 'twitter', 'miaoko'];
let proxyIPPool = [];
let socks5Data;
let alpn = '';
let 网络备案 = `<a href='https://t.me/CMLiussss'>萌ICP备-20240707号</a>`;//写你自己的维护者广告
let 额外ID = '0';
let 加密方式 = 'auto';
let 网站图标, 网站头像, 网站背景, xhttp = '';

async function 整理优选列表(api) {
	if (!api || api.length === 0) return [];

	let newapi = "";

	// 创建一个AbortController对象，用于控制fetch请求的取消
	const controller = new AbortController();

	const timeout = setTimeout(() => {
		controller.abort(); // 取消所有请求
	}, 2000); // 2秒后触发

	try {
		const responses = await Promise.allSettled(api.map(apiUrl => fetch(apiUrl, {
			method: 'get',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'User-Agent': FileName + atob('IChodHRwczovL2dpdGh1Yi5jb20vY21saXUvV29ya2VyVmxlc3Myc3ViKQ==')
			},
			signal: controller.signal 
		}).then(response => response.ok ? response.text() : Promise.reject())));

		for (const [index, response] of responses.entries()) {
			if (response.status === 'fulfilled') {
				const content = await response.value;
				const lines = content.split(/\r?\n/);
				let 节点备注 = '';
				let 测速端口 = '443';

				if (lines[0].split(',').length > 3) {
					const idMatch = api[index].match(/id=([^&]*)/);
					if (idMatch) 节点备注 = idMatch[1];

					const portMatch = api[index].match(/port=([^&]*)/);
					if (portMatch) 测速端口 = portMatch[1];

					for (let i = 1; i < lines.length; i++) {
						const columns = lines[i].split(',')[0];
						if (columns) {
							newapi += `${columns}:${测速端口}${节点备注 ? `#${节点备注}` : ''}\n`;
							if (api[index].includes('proxyip=true')) proxyIPPool.push(`${columns}:${测速端口}`);
						}
					}
				} else {
					if (api[index].includes('proxyip=true')) {
						proxyIPPool = proxyIPPool.concat((await 整理(content)).map(item => {
							const baseItem = item.split('#')[0] || item;
							if (baseItem.includes(':')) {
								const port = baseItem.split(':')[1];
								if (!httpsPorts.includes(port)) {
									return baseItem;
								}
							} else {
								return `${baseItem}:443`;
							}
							return null; 
						}).filter(Boolean)); 
					}
					newapi += content + '\n';
				}
			}
		}
	} catch (error) {
		console.error(error);
	} finally {
		clearTimeout(timeout);
	}

	const newAddressesapi = await 整理(newapi);
	return newAddressesapi;
}

async function 整理测速结果(tls) {
	if (!tls) return [];
	if (!Array.isArray(addressescsv) || addressescsv.length === 0) return [];

	function parseCSV(text) {
		return text
			.replace(/\r\n/g, '\n')
			.replace(/\r/g, '\n')
			.split('\n')
			.filter(line => line.trim() !== '')
			.map(line => line.split(',').map(cell => cell.trim()));
	}

	const csvPromises = addressescsv.map(async (csvUrl) => {
		try {
			const response = await fetch(csvUrl);
			if (!response.ok) throw new Error(`HTTP error`);
			const text = await response.text();
			const rows = parseCSV(text);
			const [header, ...dataRows] = rows;
			const tlsIndex = header.findIndex(col => col.toUpperCase() === 'TLS');
			if (tlsIndex === -1) return [];

			return dataRows
				.filter(row => {
					const tlsValue = row[tlsIndex].toUpperCase();
					const speed = parseFloat(row[row.length - 1]);
					return tlsValue === tls.toUpperCase() && speed > DLS;
				})
				.map(row => {
					const ipAddress = row[0];
					const port = row[1];
					const dataCenter = row[tlsIndex + remarkIndex];
					const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;
					if (csvUrl.includes('proxyip=true') && row[tlsIndex].toUpperCase() === 'TRUE' && !httpsPorts.includes(port)) {
						proxyIPPool.push(`${ipAddress}:${port}`);
					}
					return formattedAddress;
				});
		} catch (error) {
			return [];
		}
	});

	const results = await Promise.all(csvPromises);
	return results.flat();
}

async function 整理(内容) {
	var 替换后的内容 = 内容.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');
	if (替换后的内容.charAt(0) == ',') 替换后的内容 = 替换后的内容.slice(1);
	if (替换后的内容.charAt(替换后的内容.length - 1) == ',') 替换后的内容 = 替换后的内容.slice(0, 替换后的内容.length - 1);
	const 地址数组 = 替换后的内容.split(',');
	return 地址数组;
}

async function sendMessage(type, ip, add_data = "") {
	if (!BotToken || !ChatID) return;
	try {
		let msg = "";
		const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
		if (response.ok) {
			const ipInfo = await response.json();
			msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
		} else {
			msg = `${type}\nIP: ${ip}\n<tg-spoiler>${add_data}`;
		}
		const url = `https://api.telegram.org/bot${BotToken}/sendMessage?chat_id=${ChatID}&parse_mode=HTML&text=${encodeURIComponent(msg)}`;
		return fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
			}
		});
	} catch (error) {
		console.error('Error sending message:', error);
	}
}

async function nginx() {
	const text = `<!DOCTYPE html><html><head><title>Welcome to nginx!</title><style>body {width: 35em;margin: 0 auto;font-family: Tahoma, Verdana, Arial, sans-serif;}</style></head><body><h1>Welcome to nginx!</h1><p>If you see this page, the nginx web server is successfully installed and working. Further configuration is required.</p><p>For online documentation and support please refer to<a href="http://nginx.org/">nginx.org</a>.<br/>Commercial support is available at<a href="http://nginx.com/">nginx.com</a>.</p><p><em>Thank you for using nginx.</em></p></body></html>`
	return text;
}

function surge(content, url, path) {
	let 每行内容;
	if (content.includes('\r\n')) {
		每行内容 = content.split('\r\n');
	} else {
		每行内容 = content.split('\n');
	}
	let 输出内容 = "";
	for (let x of 每行内容) {
		if (x.includes(atob(atob('UFNCMGNtOXFZVzRz')))) {
			const host = x.split("sni=")[1].split(",")[0];
			const 备改内容 = `skip-cert-verify=true, tfo=false, udp-relay=false`;
			const 正确内容 = `skip-cert-verify=true, ws=true, ws-path=${path}, ws-headers=Host:"${host}", tfo=false, udp-relay=false`;
			输出内容 += x.replace(new RegExp(备改内容, 'g'), 正确内容).replace("[", "").replace("]", "") + '\n';
		} else {
			输出内容 += x + '\n';
		}
	}
	输出内容 = `#!MANAGED-CONFIG ${url.href} interval=86400 strict=false` + 输出内容.substring(输出内容.indexOf('\n'));
	return 输出内容;
}

function getRandomProxyByMatch(CC, socks5Data) {
	const lowerCaseMatch = CC.toLowerCase();
	let filteredProxies = socks5Data.filter(proxy => proxy.toLowerCase().endsWith(`#${lowerCaseMatch}`));
	if (filteredProxies.length === 0) {
		filteredProxies = socks5Data.filter(proxy => proxy.toLowerCase().endsWith(`#us`));
	}
	if (filteredProxies.length === 0) {
		return socks5Data[Math.floor(Math.random() * socks5Data.length)];
	}
	const randomProxy = filteredProxies[Math.floor(Math.random() * filteredProxies.length)];
	return randomProxy;
}

async function MD5MD5(text) {
	const encoder = new TextEncoder();
	const firstPass = await crypto.subtle.digest('MD5', encoder.encode(text));
	const firstPassArray = Array.from(new Uint8Array(firstPass));
	const firstHex = firstPassArray.map(b => b.toString(16).padStart(2, '0')).join('');
	const secondPass = await crypto.subtle.digest('MD5', encoder.encode(firstHex.slice(7, 27)));
	const secondPassArray = Array.from(new Uint8Array(secondPass));
	const secondHex = secondPassArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return secondHex.toLowerCase();
}

function revertFakeInfo(content, userID, hostName) {
	content = content.replace(new RegExp(fakeUserID, 'g'), userID).replace(new RegExp(fakeHostName, 'g'), hostName);
	return content;
}

function generateFakeInfo(content, userID, hostName) {
	content = content.replace(new RegExp(userID, 'g'), fakeUserID).replace(new RegExp(hostName, 'g'), fakeHostName);
	return content;
}

function isValidIPv4(address) {
	const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	return ipv4Regex.test(address);
}

function 生成动态UUID(密钥) {
	const 时区偏移 = 8; 
	const 起始日期 = new Date(2007, 6, 7, 更新时间, 0, 0); 
	const 一周的毫秒数 = 1000 * 60 * 60 * 24 * 有效时间;

	function 获取当前周数() {
		const 现在 = new Date();
		const 调整后的现在 = new Date(现在.getTime() + 时区偏移 * 60 * 60 * 1000);
		const 时间差 = Number(调整后的现在) - Number(起始日期);
		return Math.ceil(时间差 / 一周的毫秒数);
	}

	function 生成UUID(基础字符串) {
		const 哈希缓冲区 = new TextEncoder().encode(基础字符串);
		return crypto.subtle.digest('SHA-256', 哈希缓冲区).then((哈希) => {
			const 哈希数组 = Array.from(new Uint8Array(哈希));
			const 十六进制哈希 = 哈希数组.map(b => b.toString(16).padStart(2, '0')).join('');
			return `${十六进制哈希.substr(0, 8)}-${十六进制哈希.substr(8, 4)}-4${十六进制哈希.substr(13, 3)}-${(parseInt(十六进制哈希.substr(16, 2), 16) & 0x3f | 0x80).toString(16)}${十六进制哈希.substr(18, 2)}-${十六进制哈希.substr(20, 12)}`;
		});
	}

	const 当前周数 = 获取当前周数(); 
	const 结束时间 = new Date(起始日期.getTime() + 当前周数 * 一周的毫秒数);
	const 当前UUIDPromise = 生成UUID(密钥 + 当前周数);
	const 上一个UUIDPromise = 生成UUID(密钥 + (当前周数 - 1));
	const 到期时间UTC = new Date(结束时间.getTime() - 时区偏移 * 60 * 60 * 1000); 
	const 到期时间字符串 = `到期时间(UTC): ${到期时间UTC.toISOString().slice(0, 19).replace('T', ' ')} (UTC+8): ${结束时间.toISOString().slice(0, 19).replace('T', ' ')}\n`;
	return Promise.all([当前UUIDPromise, 上一个UUIDPromise, 到期时间字符串]);
}

async function getLink(重新汇总所有链接) {
	let 节点LINK = [];
	let 订阅链接 = [];
	for (let x of 重新汇总所有链接) {
		if (x.toLowerCase().startsWith('http')) {
			订阅链接.push(x);
		} else {
			节点LINK.push(x);
		}
	}

	if (订阅链接 && 订阅链接.length !== 0) {
		function base64Decode(str) {
			const bytes = new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));
			const decoder = new TextDecoder('utf-8');
			return decoder.decode(bytes);
		}
		const controller = new AbortController(); 
		const timeout = setTimeout(() => {
			controller.abort(); 
		}, 2000);

		try {
			const responses = await Promise.allSettled(订阅链接.map(apiUrl => fetch(apiUrl, {
				method: 'get',
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;',
					'User-Agent': 'v2rayN/' + FileName + ' (https://github.com/cmliu/WorkerVless2sub)'
				},
				signal: controller.signal 
			}).then(response => response.ok ? response.text() : Promise.reject())));

			const modifiedResponses = responses.map((response, index) => {
				return {
					status: response.status,
					value: response.status === 'fulfilled' ? response.value : null,
					apiUrl: 订阅链接[index] 
				};
			});

			for (const response of modifiedResponses) {
				if (response.status === 'fulfilled') {
					const content = await response.value || 'null'; 
					if (content.includes('://')) {
						const lines = content.includes('\r\n') ? content.split('\r\n') : content.split('\n');
						节点LINK = 节点LINK.concat(lines);
					} else {
						const 尝试base64解码内容 = base64Decode(content);
						if (尝试base64解码内容.includes('://')) {
							const lines = 尝试base64解码内容.includes('\r\n') ? 尝试base64解码内容.split('\r\n') : 尝试base64解码内容.split('\n');
							节点LINK = 节点LINK.concat(lines);
						}
					}
				}
			}
		} catch (error) {
			console.error(error); 
		} finally {
			clearTimeout(timeout); 
		}
	}
	return 节点LINK;
}

function utf8ToBase64(str) {
	return btoa(unescape(encodeURIComponent(str)));
}

async function subHtml(request) {
	const url = new URL(request.url);
	const HTML = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>${FileName}</title>
				${网站图标}
				<style>
					:root { --primary-color: #4361ee; --hover-color: #3b4fd3; --bg-color: #f5f6fa; --card-bg: #ffffff; }
					* { box-sizing: border-box; margin: 0; padding: 0; }
					body { ${网站背景} background-size: cover; background-position: center; background-attachment: fixed; background-color: var(--bg-color); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
					.container { position: relative; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); max-width: 600px; width: 90%; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.1); transition: transform 0.3s ease; }
					.container:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2); }
					h1 { text-align: center; color: var(--primary-color); margin-bottom: 2rem; font-size: 1.8rem; }
					.input-group { margin-bottom: 1.5rem; }
					label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500; }
					input { width: 100%; padding: 12px; border: 2px solid rgba(0, 0, 0, 0.15); border-radius: 10px; font-size: 1rem; transition: all 0.3s ease; box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03); }
					input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.03); }
					button { width: 100%; padding: 12px; background-color: var(--primary-color); color: white; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-bottom: 1.5rem; }
					button:hover { background-color: var(--hover-color); transform: translateY(-2px); }
					button:active { transform: translateY(0); }
					#result { background-color: #f8f9fa; font-family: monospace; word-break: break-all; }
					.github-corner svg { fill: var(--primary-color); color: var(--card-bg); position: absolute; top: 0; right: 0; border: 0; width: 80px; height: 80px; }
					.github-corner:hover .octo-arm { animation: octocat-wave 560ms ease-in-out; }
					@keyframes octocat-wave { 0%, 100% { transform: rotate(0) } 20%, 60% { transform: rotate(-25deg) } 40%, 80% { transform: rotate(10deg) } }
					@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
					.logo-title { position: relative; display: flex; justify-content: center; align-items: center; margin-bottom: 2rem; }
					.logo-wrapper { position: absolute; left: 0; width: 50px; height: 50px; }
					.logo-title img { width: 100%; height: 100%; border-radius: 50%; position: relative; z-index: 1; background: var(--card-bg); box-shadow: 0 0 15px rgba(67, 97, 238, 0.1); }
					.logo-border { position: absolute; top: -3px; left: -3px; right: -3px; bottom: -3px; border-radius: 50%; animation: rotate 3s linear infinite; background: conic-gradient( from 0deg, transparent 0%, var(--primary-color) 20%, rgba(67, 97, 238, 0.8) 40%, transparent 60%, transparent 100% ); box-shadow: 0 0 10px rgba(67, 97, 238, 0.3); filter: blur(0.5px); }
					.logo-border::after { content: ''; position: absolute; inset: 3px; border-radius: 50%; background: var(--card-bg); }
					.logo-title h1 { margin-bottom: 0; text-align: center; }
					@media (max-width: 480px) { .container { padding: 1.5rem; } h1 { font-size: 1.5rem; } .github-corner:hover .octo-arm { animation: none; } .github-corner .octo-arm { animation: octocat-wave 560ms ease-in-out; } .logo-wrapper { width: 40px; height: 40px; } }
					.beian-info { text-align: center; font-size: 13px; }
					.beian-info a { color: var(--primary-color); text-decoration: none; border-bottom: 1px dashed var(--primary-color); padding-bottom: 2px; }
					.beian-info a:hover { border-bottom-style: solid; }
					#qrcode { display: flex; justify-content: center; align-items: center; margin-top: 20px; }
					.info-icon { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background-color: var(--primary-color); color: white; font-size: 12px; margin-left: 8px; cursor
