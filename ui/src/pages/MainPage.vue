<script setup lang="ts">
import { BlastAlphabetType } from '@platforma-open/milaboratories.blast.model';
import {
  PlBlockPage,
  PlBtnPrimary,
  PlDropdown,
  PlFileInput,
  PlLogView,
  PlSlideModal,
  PlTextArea,
  ReactiveFileContent
} from '@platforma-sdk/ui-vue';
import { computed, ref } from 'vue';
import { useApp } from '../app';

const app = useApp();

const queryIsShown = ref(app.model.outputs.txtAlignments === undefined);
const showQuery = () => {
  queryIsShown.value = true;
};

const alignments = computed(() => {
  return ReactiveFileContent.getContentString(app.model.outputs.txtAlignments?.handle);
});

const blastAlphabetType = computed(() => {
  return app.model.outputs.dbSpec?.annotations?.['pl7.app/blast/alphabetType'] as
    | BlastAlphabetType
    | undefined;
});

const blastnProgramOptions = [
  {
    text: 'Highly similar sequences (megablast)',
    value: 'megablast'
  },
  {
    text: 'Optimize for More dissimilar sequences (discontiguous megablast)',
    value: 'dc-megablast'
  },
  {
    text: 'Optimize for Somewhat similar sequences (blastn)',
    value: 'blastn'
  }
];

const blastpProgramOptions = [
  {
    text: 'Quick BLASTP (Accelerated protein-protein BLAST)',
    value: 'blasp-fast'
  },
  {
    text: 'BLASTP (protein-protein BLAST)',
    value: 'dc-megablast'
  }
];

const placeholder = `>sequenceId
GGTTCCAGAGCAAAAGGATGTTGATACAACGCATATCTCCACCTTTTCTTCAAAGTCTTTACGCTTACACGGAAAGACTT
CTTCAACTGCCATGCATCAGGGTCAGGGGGAGGTCTTGTTACAACACAGATCTGCGGATCTCCGGGGTTTGACTGTGGCA
CCTAATATATCTGGCTAAGAAAACTTGTAAGTTCTTAGATTGTCCCAAAGGTGGCGCATGAAATCAAAGCAGGAGAACAG
TTGGCGGACTCTGCGTGGACTTGGAGCTCACAGCGTCTTGCGACTTGGAAGCGGATTCAGAGGACAGGACAGAACACTTG
GACAAGTGAATCTCTGTCTGTCTGTCTGTCTGTCTGTCTGTCTCATTGGTTGGTTGATTTCCATTTTCTTAAGGGGCACA
TACCTCACACCGCACACACACAAACACACACACGCACACACACACACACACACGCACACACACGCACACACACTCCTTCC`;
</script>

<template>
  <PlBlockPage>
    <template #title>BLAST Local Database</template>
    <template #append>
      <PlBtnPrimary @click.stop="showQuery">Query</PlBtnPrimary>
    </template>

    <PlSlideModal v-model="queryIsShown" width="800px">
      <template #title>Query</template>
      <PlDropdown v-model="app.model.args.dbRef" :options="app.model.outputs.dbOptions ?? []" label="Select database" />

      <PlTextArea v-model="app.model.args.sequences" :rows="20" :placeholder="placeholder" label="Enter FASTA sequence(s) "
        :disabled="app.model.args.fastaFile !== undefined" clearable />

      <PlFileInput v-model="app.model.args.fastaFile" label="Or import query file"
        :progress="app.model.outputs.importProgress" />

      <h3>Program Selection</h3>
      <PlDropdown v-model="app.model.args.blastnProgram" :options="blastnProgramOptions"
        v-if="blastAlphabetType === 'nucl'" />
      <PlDropdown v-model="app.model.args.blastpProgram" :options="blastpProgramOptions"
        v-if="blastAlphabetType === 'prot'" />
    </PlSlideModal>

    <PlLogView :value="app.model.outputs.log" v-if="!alignments" />
    <pre>{{ alignments }}</pre>
  </PlBlockPage>
</template>
