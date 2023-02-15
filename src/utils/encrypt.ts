import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALYMkxHLfIqnDmhK4mWkHUYoRluY2TmY\n' +
  'NcZz+IUvcX1IRbSVdM31LMgPvgjsz95bWeqw8I0W3nwgfQ32yt+b5CUCAwEAAQ=='

const privateKey =
  'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAtgyTEct8iqcOaEri\n' +
  'ZaQdRihGW5jZOZg1xnP4hS9xfUhFtJV0zfUsyA++COzP3ltZ6rDwjRbefCB9DfbK\n' +
  '35vkJQIDAQABAkBa7nb7eXeQzhbdMyJYgJv6sh1KnVNLeGLL6Jtm8yat23XWcnD5\n' +
  '/14PEVSoVXKRYkY3azo2XC1mlREyepJcTsK1AiEA76dPn82177vYt2RkRhcCMVyZ\n' +
  'yHhIiH679Hgub0lo7XsCIQDCd2ijIILeXu+SxVTIoePRGihhQl9N18XmIM6piIky\n' +
  '3wIgFjNCjgQpYW7eUYbMPy3sdxQj7s0tsu9CjBACBS8guDcCIQCh37XZPCHTquDv\n' +
  'opUtoRy7HXQJaa9dY8RXCG4ezwmtrwIge9xThuj1CcHdwG582Z2Up6R5h2q+FDO5\n' +
  'LEa8Du7je78='

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt({})
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
