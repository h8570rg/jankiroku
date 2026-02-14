import {
  Slider as HeroUiSlider,
  type SliderOutputProps as HeroUiSliderOutputProps,
  type SliderProps as HeroUiSliderProps,
  Label,
} from "@heroui/react";

export type SliderProps = Omit<HeroUiSliderProps, "label"> & {
  label?: string;
  outputProps?: HeroUiSliderOutputProps;
  name?: string;
};

export function Slider({ label, outputProps, name, ...props }: SliderProps) {
  return (
    <HeroUiSlider {...props}>
      <Label>{label}</Label>
      <HeroUiSlider.Output {...outputProps} />
      <HeroUiSlider.Track>
        <HeroUiSlider.Fill />
        <HeroUiSlider.Thumb name={name} />
      </HeroUiSlider.Track>
    </HeroUiSlider>
  );
}
