## What makes it white-hat

I focused on having a plain, simple and easy to understeand visualization.
The Map has a color-blind friendly encoding and a more accurate legend based on death ratio, the map is shown in its integrity and with bigger margins, everithing has more space.
Now also the cities are able to show their data, each city has a circle with the area proportional to the number of deaths and for convinience I decided to show only cities with at least 10 deaths.
The bottom chart visually shows the ratio between male and female crime based on each state, the stacked bar chart helps this visual ratio, the total number is not shown directly but can be easly found on the map, also the bottom chart is wider and has bigger margins

### Additional consideration

The representation of the rates per capita is a little tricky; having Washington DC as the highest rate per capita, shifted the maximum rate to almost 50% more than the second max rate, resulting in the map having mostly a similar color.
I wasn't sure if it was better to consider it as a state or just a city, but it is a little political.
I believe a reasonable compromise would have been setting all the rates higher than a threshold close to the second highest maximum to be represented by the same color, but I don't know if doing so would affect the accuracy of the rate representation.

### Sources

- State map: https://eric.clst.org/tech/usgeojson/
- Original state population: US Census
  https://www.census.gov/data/tables/time-series/demo/popest/2010s-state-total.html
- Original Slate gun violence dataset:
  https://www.slate.com/articles/news_and_politics/crime/2012/12/gun_death_tally_every_american_gun_death_since_newtown_sandy_hook_shooting.html
