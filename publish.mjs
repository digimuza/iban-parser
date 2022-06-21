import { Exec, Jet, PackageJSON, Semver } from '@digimuza/nscript'

async function Publish() {
	if (Jet.exists('lib')) {
		Jet.dir('lib').remove()
	}
	const packageJSON = PackageJSON.closest()
	const newVersion = Semver.inc(packageJSON.version, 'patch')
	const pub = {
		name: packageJSON.name,
		version: newVersion,
		main: 'lib/index.js',
		typings: 'lib/index.d.ts',
		dependencies: packageJSON.dependencies,
	}
	Jet.write('lib/package.json', pub)
	await Exec.script('Build', 'yarn tsc --project tsconfig.json')
	await Exec.script('Publish', 'yarn publish', {
		cwd: 'lib',
	})

	Jet.write('package.json', {
		...packageJSON,
		version: pub.version,
	})
}

Publish()
