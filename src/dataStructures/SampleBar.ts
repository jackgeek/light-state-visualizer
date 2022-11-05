interface ISample {
  ms: number;
  isOn: boolean;
}

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

export function createSampleBar() {
  const samples: Array<ISample> = [];

  function addSample(newSample: Readonly<ISample>) {
    const insertionPoint = samples.findIndex(before(newSample.ms));

    samples.splice(insertionPoint, 0, newSample);
  }

  function sampleIndexOnOrBefore(ms: number) {
    for (let i = samples.length - 1; i > 0; i = -1) {
      if (samples[i].ms <= ms) {
        return i;
      }
    }
    return 0;
  }

  function sampleIndexOnOrAfter(ms: number) {
    const index = samples.findIndex((sample) => sample.ms >= ms);
    if (index === -1) {
      return samples.length - 1;
    }
    return index;
  }

  function getValueBetween(startMs: number, endMs: number) {
    const sampleStartIndex = sampleIndexOnOrBefore(startMs);
    const sampleEndIndex = sampleIndexOnOrAfter(endMs);
    console.log({ sampleStartIndex, sampleEndIndex });
    const samplesInWindow = samples.slice(sampleStartIndex, sampleEndIndex - sampleStartIndex + 1);
    console.log(samplesInWindow);
    let onDuration = 0;
    for (
      let sampleIndex = 0, winLength = samplesInWindow.length;
      sampleIndex < winLength;
      sampleIndex += 1
    ) {
      const sample = samplesInWindow[sampleIndex];
      const sampleBefore = samplesInWindow[Math.max(sampleIndex - 1, 0)];
      console.log({ sample, sampleBefore });
      if (sampleBefore.isOn) {
        onDuration += Math.max(sampleBefore.ms, startMs) - sample.ms;
        console.log({ onDuration });
        console.log(sampleBefore.ms, startMs, sample.ms);
      }
    }
    const lastSample = samplesInWindow.at(-1);
    if (lastSample?.isOn) {
      onDuration += endMs - lastSample.ms;
    }
    console.log(onDuration);
    return (1 / (endMs - startMs)) * onDuration;
  }

  function getRow(width: number) {
    if (width <= 0 || Math.trunc(width) !== width) {
      throw Error("Width must be a positive integer");
    }
    if (samples.length === 0) {
      return [];
    }
    const pixelSpan = MILLISECONDS_IN_A_DAY / width;
    const row: Array<number> = [];
    for (let p = 0; p < width; p += 1) {
      row.push(getValueBetween(p * pixelSpan, (p + 1) * pixelSpan));
    }

    return row;
  }

  return {
    addSample,
    getRow,
  };
}

const before =
  (when: number) =>
  ({ ms }: ISample) =>
    when < ms;
