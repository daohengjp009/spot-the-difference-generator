# Example Prompts for AI Generation

## Theme Prompts

### Playground Theme
```
Generate a bright, cheerful playground scene with kawaii style. Include:
- Colorful play equipment (swings, slides, seesaws, sandbox)
- Happy children playing and having fun
- Trees and grass
- Bright sky
- Small details like balls, ropes, buckets
- Soft pastel color palette
- High level of detail for puzzle creation
```

### Underwater Theme
```
Create a magical underwater scene with kawaii art style. Include:
- Various colorful fish and sea creatures
- Coral reefs and sea plants
- Treasure chest
- Bubbles and water effects
- Sunlight filtering from above
- Sand and rocks on the seafloor
- Starfish and sea shells
- Soft blue and green color palette
```

### Zoo Theme
```
Design a vibrant zoo scene with kawaii characters. Include:
- 5-7 different animals (lions, giraffes, monkeys, penguins, zebras)
- Zookeepers and visitors
- Natural habitats and enclosures
- Trees, grass, rocks
- Zoo buildings in background
- Bright, cheerful colors
- Good visibility of all elements
```

### Classroom Theme
```
Create a happy classroom scene with kawaii style. Include:
- Students sitting at desks
- Teacher at blackboard
- Desks with books and supplies
- Decorations on walls (posters, drawings)
- Light from windows
- Globe, apple, books
- Bright, warm colors
- Child-friendly environment
```

### Farm Theme
```
Generate a cheerful farm scene. Include:
- Farm animals (cows, chickens, sheep, pigs, horses)
- Farm buildings (barn, chicken coop)
- Crops and fields
- Farmer characters
- Farm equipment and tools
- Fences and gates
- Blue sky and green fields
- Kawaii art style
```

## Difference Instructions Examples

### Easy Puzzle (5 differences)
```json
[
  {
    "type": "missing_object",
    "description": "Remove one cloud from the sky",
    "severity": "easy"
  },
  {
    "type": "color_change",
    "description": "Change the color of the middle swing from red to blue",
    "severity": "easy"
  },
  {
    "type": "added_object",
    "description": "Add a small bird on a branch",
    "severity": "easy"
  },
  {
    "type": "object_movement",
    "description": "Move the ball from left to right side",
    "severity": "easy"
  },
  {
    "type": "clothing_change",
    "description": "Change child's hat color from purple to yellow",
    "severity": "easy"
  }
]
```

### Medium Puzzle (8 differences)
```json
[
  {
    "type": "missing_object",
    "description": "Remove the flower pot"
  },
  {
    "type": "added_object",
    "description": "Add a butterfly"
  },
  {
    "type": "color_change",
    "description": "Change fence color from brown to gray"
  },
  {
    "type": "expression_change",
    "description": "Change child's smile to surprised face"
  },
  {
    "type": "clothing_change",
    "description": "Change shoes from red to green"
  },
  {
    "type": "object_movement",
    "description": "Move the swing position slightly"
  },
  {
    "type": "accessory_change",
    "description": "Add glasses to the character"
  },
  {
    "type": "background_change",
    "description": "Change cloud visibility"
  }
]
```

### Hard Puzzle (12 differences)
```json
[
  {
    "type": "missing_object",
    "description": "Remove one tree"
  },
  {
    "type": "added_object",
    "description": "Add a kite in sky"
  },
  {
    "type": "color_change",
    "description": "Change slide color"
  },
  {
    "type": "color_change",
    "description": "Change rope color"
  },
  {
    "type": "expression_change",
    "description": "Change face expression"
  },
  {
    "type": "clothing_change",
    "description": "Change shirt color"
  },
  {
    "type": "clothing_change",
    "description": "Add hat to character"
  },
  {
    "type": "object_movement",
    "description": "Reposition object 1"
  },
  {
    "type": "object_movement",
    "description": "Reposition object 2"
  },
  {
    "type": "accessory_change",
    "description": "Add watch to character"
  },
  {
    "type": "background_change",
    "description": "Add more clouds"
  },
  {
    "type": "missing_object",
    "description": "Remove small detail"
  }
]
```

## Prompt Engineering Best Practices

### Image Generation Tips
1. **Be specific about style**: Always mention "kawaii style" or "cute art"
2. **Use color descriptors**: "soft pastels", "bright primary colors"
3. **Indicate detail level**: "high level of detail", "many small objects"
4. **Specify composition**: "square format", "centered", "balanced"
5. **Include atmosphere**: "bright sunny day", "cheerful mood", "playful"

### Difference Creation Tips
1. **Variety**: Mix different difference types
2. **Subtlety**: Make them findable but not obvious
3. **Distribution**: Spread across the image
4. **Realism**: Changes should make logical sense
5. **Consistency**: Keep same art style and quality

### Example of Bad Difference
```json
{
  "type": "missing_object",
  "description": "Change everything"  // Too vague
}
```

### Example of Good Difference
```json
{
  "type": "missing_object",
  "description": "The small red apple on the table is missing"  // Specific and clear
}
```

## Theme-Specific Difference Ideas

### Playground
- Swing rope color
- Child's clothing items
- Cloud presence
- Flower color
- Bench orientation
- Ball position
- Tree missing
- Sandbox bucket

### Underwater
- Fish type
- Coral color
- Bubble count
- Rock position
- Treasure chest lid
- Sea plant type
- Character expression
- Shell color

### Zoo
- Animal presence
- Animal facing direction
- Zookeeper accessory
- Fence color
- Background building
- Visitor clothing
- Path detail
- Sign text

### Classroom
- Student count
- Desk arrangement
- Board content
- Window position
- Door color
- Plant presence
- Book stack
- Clock time

### Farm
- Animal type
- Barn door
- Fence section
- Crop color
- Farmer hat
- Tool position
- Sky element
- Water trough

## Performance Optimization Prompts

### Faster Generation
```
Generate a simple, bright playground scene.
Focus on main objects only.
Use clear colors.
Minimize complex details.
```

### Higher Quality
```
Create a detailed, high-quality playground scene.
Include many small objects and details.
Use proper perspective and lighting.
Include depth and shadowing.
Premium quality rendering.
```

### Accessibility
```
Generate a playground scene that is:
- Highly readable for all ages
- Clear color contrast
- Unambiguous objects
- Child-friendly
- No dark or scary elements
```

## Seed-Based Generation

For consistent regeneration of the same theme:
```python
# Use seed for reproducibility
seed = "playground-easy-20240101"
prompt = f"Generate playground scene {seed}"
```

This allows users to:
- Regenerate same puzzle
- Create variations
- Maintain consistency across themes
