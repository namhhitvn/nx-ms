import {
  convertNxGenerator,
  generateFiles,
  GeneratorCallback,
  getWorkspaceLayout,
  installPackagesTask,
  joinPathFragments,
  names,
  offsetFromRoot,
  ProjectConfiguration,
  readJson,
  TargetConfiguration,
  toJS,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { applicationGenerator as nodeApplicationGenerator } from '@nrwl/node';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { getRelativePathToRootTsConfig } from '@nrwl/workspace/src/utilities/typescript';
import { join } from 'path';
import { Schema } from './schema';

export interface NormalizedSchema extends Schema {
  appProjectRoot: string;
  appProjectPath: string;
  parsedTags: string[];
}

async function applicationGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(tree, schema);
  const tasks: GeneratorCallback[] = [];

  await nodeApplicationGenerator(tree, schema);

  addAppFiles(tree, options);
  addAppProject(tree, options);

  tasks.push(installPackages(tree));

  return runTasksInSerial(...tasks);
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const { appsDir } = getWorkspaceLayout(tree);

  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const appProjectRoot = joinPathFragments(appsDir, appDirectory);

  const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  return {
    ...options,
    name: names(appProjectName).fileName,
    frontendProject: options.frontendProject ? names(options.frontendProject).fileName : undefined,
    appProjectRoot,
    appProjectPath: join(tree.root, appProjectRoot),
    parsedTags,
    linter: options.linter ?? Linter.EsLint,
    unitTestRunner: options.unitTestRunner ?? 'jest',
  };
}

function addAppFiles(tree: Tree, options: NormalizedSchema) {
  // cleanup files generate by @nrwl/node
  tree.listChanges().forEach(({ path }) => {
    if (path.includes('/src') || path.includes('/tsconfig.app.json')) {
      tree.delete(path);
    }
  });

  generateFiles(tree, join(__dirname, './files'), options.appProjectRoot, {
    tmpl: '',
    name: options.name,
    root: options.appProjectRoot,
    offset: offsetFromRoot(options.appProjectRoot),
    rootTsConfigPath: getRelativePathToRootTsConfig(tree, options.appProjectRoot),
  });

  if (options.js) {
    toJS(tree);
  }
}

function addAppProject(tree: Tree, options: NormalizedSchema) {
  const project: ProjectConfiguration = {
    root: options.appProjectRoot,
    sourceRoot: joinPathFragments(options.appProjectRoot, 'src'),
    projectType: 'application',
    targets: {
      serve: getServeConfig(options),
    },
    tags: options.parsedTags,
  };

  updateProjectConfiguration(tree, options.name, project);
}

function getServeConfig(options: NormalizedSchema): TargetConfiguration {
  const entryFilePath = `dist/${options.name}/${options.appProjectRoot}/src/index.js`;

  return {
    executor: 'nx:run-commands',
    defaultConfiguration: 'development',
    configurations: {
      development: {
        command: `tsc-watch --noClear -p ${options.appProjectRoot}/tsconfig.app.json --onSuccess "node --inspect=0.0.0.0:9229 -r source-map-support/register ${entryFilePath}"`,
      },
      production: {
        command: `tsc -p ${options.appProjectRoot}/tsconfig.app.json && node -r source-map-support/register ${entryFilePath}`,
      },
    },
  };
}

function installPackages(tree: Tree): GeneratorCallback {
  const ableToInstall = [
    installPackage(tree, 'module-alias', '^2.2.2'),
    installPackage(tree, 'tsconfig-paths', '^4.1.0'),
    installPackage(tree, 'tsc-watch', '^5.0.3', true),
    installPackage(tree, 'source-map-support', '^0.5.21', true),
  ].some((v) => v);

  return () => {
    if (ableToInstall) {
      installPackagesTask(tree);
    }
  };
}

function installPackage(
  tree: Tree,
  packageName: string,
  packageVersion: string,
  isDevDependencies = false
): true | void {
  const dependenciesKey = isDevDependencies ? 'devDependencies' : 'dependencies';
  const installed = readJson(tree, 'package.json')[dependenciesKey]?.[packageName];

  if (installed) {
    return true;
  }

  updateJson(tree, 'package.json', (json) => {
    json[dependenciesKey] = json[dependenciesKey] || {};
    json[dependenciesKey][packageName] = packageVersion;
    return json;
  });
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
