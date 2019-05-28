import fs from 'fs'
import path from 'path'
import root from '../root.mjs'

const fsPromises = fs.promises

export default async (publicPath) => {
  const deploymentSecretBuffer = await fsPromises.readFile(path.join(root, '.deployment-secret'))
  const deploymentSecret = deploymentSecretBuffer.toString().replace(/[^a-zA-Z0-9]/g, '')

  const script = [
    `<?php`,
    `$secret = '${deploymentSecret}';`,
    `$request_body = file_get_contents('php://input');`,
    `$computed_hmac = hash_hmac('sha1', $request_body, $secret);`,
    `$send_hmac = substr($_SERVER['HTTP_X_HUB_SIGNATURE'], 5);`,
    ``,
    `if ($send_hmac !== $computed_hmac) exit;`,
    `shell_exec(dirname(__FILE__) . '/../deployment-hook.sh');`,
  ].join('\n')

  const fileHandle = await fsPromises.open(path.join(publicPath, 'deployment-hook.php'), 'w')
  await fileHandle.write(script)
  await fileHandle.close()
}
