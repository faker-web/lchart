import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Pie } from '../components/pie';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/pie',
  component: Pie,
  parameters: {
    docs: {
      description: {
        component: 'A Component for bar',
      },
    },
  },
} as ComponentMeta<typeof Pie>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Pie> = (args) => <Pie {...args} />;

const data = [{
  name: '商品一',
  num: 90,
  color: 'red', 
},{
  name: '商品二',
  num: 160, 
  color: 'blue', 
},{
  name: '商品三',
  num: 190, 
  color: 'black', 
},{
  name: '商品四',
  num: 120, 
  color: 'green', 
},{
  name: '商品五',
  num: 150, 
  color: 'pink', 
}]


export const BasePie = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
BasePie.args = {
  padding: 30,
  data,
  duration: 1000,
  radius: 200,
};

export const NightingaleRose = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
NightingaleRose.args = {
  padding: 30,
  data,
  duration: 1000,
  radius: 200,
  isNightingaleRose: true,
};

export const Ring = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Ring.args = {
  padding: 30,
  data,
  duration: 1000,
  radius: 200,
  innerRadius: 150,
};

export const RingNightingaleRose = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
RingNightingaleRose.args = {
  padding: 30,
  data,
  duration: 1000,
  radius: 200,
  isNightingaleRose: true,
  innerRadius: 30,
};
