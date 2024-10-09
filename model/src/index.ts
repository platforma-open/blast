import { BlockModel, ImportFileHandle, InferOutputsType, Ref } from '@platforma-sdk/model';

export type BlastAlphabetType = 'prot' | 'nucl';

export type BlockArgs = {
  dbRef?: Ref;
  sequences?: string;
  fastaFile?: ImportFileHandle;
  blastnProgram: string;
  blastpProgram: string;
};

export const model = BlockModel.create<BlockArgs>('Heavy')

  .initialArgs({
    blastnProgram: 'megablast',
    blastpProgram: 'blastp-fast'
  })

  .argsValid(
    (ctx) =>
      ctx.args.dbRef !== undefined &&
      (ctx.args.sequences !== undefined || ctx.args.fastaFile !== undefined)
  )

  .output('dbOptions', (ctx) => {
    return ctx.resultPool
      .getOptions(
        (spec) => spec.kind === 'fileSet' && spec.annotations?.['pl7.app/type'] === 'blastDB'
      )
      .map((s) => ({
        label: s.label,
        value: s.ref
      }));
  })

  .output('dbSpec', (ctx) => {
    if (!ctx.args.dbRef) return undefined;

    return ctx.resultPool.getSpecByRef(ctx.args.dbRef);
  })

  .output('importProgress', (ctx) => ctx.outputs?.resolve('importHandle')?.getImportProgress())

  .output('log', (ctx) => ctx.outputs?.resolve('log')?.getLastLogs(100))

  .output('txtAlignments', (ctx) => ctx.outputs?.resolve('txtAlignments')?.getFileHandle())

  .sections([{ type: 'link', href: '/', label: 'Main' }])

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
