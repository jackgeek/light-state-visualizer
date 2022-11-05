import { createSampleBar } from "../SampleBar";

test("getRow returns [] if no samples present", () => {
  // Arrange
  const sampleBar = createSampleBar();

  // Act
  const result = sampleBar.getRow(1);

  // Assert
  expect(result).toEqual([]);
});

test("getRow throws if width is 0 or not an integer", () => {
  // Arrange
  const sampleBar = createSampleBar();

  // Act
  const tryWidth = (width: number) => sampleBar.getRow(width);

  // Assert
  expect(() => tryWidth(0)).toThrowError("Width must be a positive integer");
  expect(() => tryWidth(3.141)).toThrowError("Width must be a positive integer");
});
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

test.only("A single ON sample should mark the whole day as 1", () => {
  // Arrange
  const sampleBar = createSampleBar();

  // Act
  sampleBar.addSample({
    ms: MILLISECONDS_IN_A_DAY / 2,
    isOn: true,
  });

  // Assert
  console.log(sampleBar.getRow(1));
});
