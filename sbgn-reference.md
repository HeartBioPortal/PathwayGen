# SBGN Reference Guide

## Introduction to SBGN

The Systems Biology Graphical Notation (SBGN) is a standardized graphical representation developed by a community of biochemists, modelers, and computer scientists to enable precise and unambiguous visualization of biological networks and pathways. SBGN provides a consistent way to represent biological information in diagrams, similar to how circuit diagrams standardize representation in electrical engineering.

SBGN was created to address the lack of standardized graphical notations in biology, despite the field having one of the highest ratios of graphical to textual information. The standardization helps accelerate work by promoting regularity, removing ambiguity, and enabling software tool support for communication of complex biological information.

## SBGN Languages

SBGN consists of three orthogonal and complementary languages, each designed to address different aspects of biological systems:

### 1. Process Description (PD)

The Process Description language shows the temporal courses of biochemical interactions in a network. It can be used to show all the molecular interactions taking place in a network of biochemical entities, with the same entity potentially appearing multiple times in the same diagram.

Process Description is ideal for representing:
- Metabolic pathways
- Signal transduction pathways
- Gene regulatory processes
- Molecular transformations

The key concept in PD diagrams is the process node, which typically includes:
1. Incoming consumption links to the process
2. Production links from the process
3. Regulatory links to the process (e.g., stimulation or inhibition)

### 2. Entity Relationship (ER)

The Entity Relationship language allows you to see all the relationships in which a given entity participates, regardless of the temporal aspects. Relationships can be seen as rules describing the influences of entity nodes on other relationships.

Entity Relationship is suitable for:
- Showing all interactions of a particular molecular entity
- Representing complex rules and influences
- Depicting static relationships between entities

### 3. Activity Flow (AF)

The Activity Flow language depicts the flow of information between biochemical entities in a network. It omits information about the state transitions of entities and is particularly convenient for representing the effects of perturbations, whether genetic or environmental in nature.

Activity Flow is useful for:
- Signaling pathways
- Gene regulatory networks
- High-level overviews of biological processes

## SBGN PD Symbols and Glyphs

The Process Description language uses a specific set of symbols to represent different biological entities and interactions:

### Entity Pool Nodes

- **Simple Chemical**: Circle or ellipse representing small molecules or metabolites
- **Macromolecule**: Rounded rectangle representing proteins, large polysaccharides, etc.
- **Nucleic Acid Feature**: Hexagon or modified rectangle for DNA, RNA segments
- **Complex**: Cut-corner rectangle representing molecular complexes
- **Empty Set**: Empty set symbol (∅) for source/sink of reactions
- **Perturbation**: Modified hexagon for external influences
- **Unspecified Entity**: Question mark for unknown entities

### Process Nodes

- **Process**: Square for biochemical reactions or transformations
- **Association**: Circle with "+" for complex formation
- **Dissociation**: Circle with "×" for complex dissociation
- **Omitted Process**: Two parallel lines for abbreviated processes

### Connecting Arcs

- **Consumption**: Line with no arrowhead for substrates
- **Production**: Line with filled arrowhead for products
- **Catalysis**: Line with circular arrowhead for enzymes
- **Inhibition**: Line with bar end for inhibitors
- **Stimulation**: Line with empty arrowhead for activators
- **Modulation**: Line with diamond arrowhead for modulators
- **Logic Arc**: Line connecting logical operators

### Auxiliary Units

- **State Variable**: Elliptic node for entity state (e.g., phosphorylation)
- **Unit of Information**: Rectangular node for additional information
- **Clone Marker**: Identifies identical nodes

### Logical Operators

- **AND**: Node indicating that all inputs are necessary
- **OR**: Node indicating that any input is sufficient
- **NOT**: Node indicating logical negation

### Compartments

- **Compartment**: Container representing cellular locations and boundaries

## SBGN PD Example: Glucose Phosphorylation

A simple example of glucose phosphorylation by hexokinase in SBGN PD notation:

```
[Glucose] ----→ [Process] ----→ [Glucose-6P]
    ↑              ↑
    |              |
  [ATP]         [Hexokinase]
    |              |
    ↓              ↓
   [ADP]         [P]
```

In this example:
- Glucose and ATP are consumed (consumption arcs)
- Glucose-6P and ADP are produced (production arcs)
- Hexokinase catalyzes the reaction (catalysis arc)
- P (phosphate) is a state variable indicating phosphorylation

## SBGN-ML: The XML Format for SBGN

SBGN visualizations can be exchanged using SBGN-ML, an XML-based file format specifically designed for storing and exchanging SBGN diagrams. SBGN-ML allows for the interoperability of different software tools that support SBGN.

The libSBGN software library provides functions for reading, writing, and manipulating SBGN maps stored in SBGN-ML format.

## Software Support for SBGN

Various software tools support SBGN visualization:

### Editors
- CellDesigner
- Newt Editor
- SBGN-ED (VANTED add-on)
- PathVisio
- Krayon for SBGN
- ySBGN

### Databases with SBGN Export
- Reactome
- PANTHER Pathway
- BioModels database
- Pathway Commons
- Atlas of Cancer Signalling Networks

### Converters
- BioPAX to SBGN
- KEGG to SBGN
- SBML to SBGN

## Best Practices for SBGN Diagrams

1. **Maintain clarity**: Avoid overcrowding diagrams with too many elements
2. **Use consistent styling**: Apply uniform visual attributes for similar entities
3. **Group related processes**: Use compartments to organize related processes
4. **Add appropriate annotations**: Include relevant metadata and references
5. **Follow the specification**: Adhere to SBGN language rules for interoperability
6. **Consider the audience**: Choose the appropriate SBGN language for your purpose
7. **Include legends**: Provide explanations for any custom notations or colors

## References

For more detailed information about SBGN, consult the following resources:

1. SBGN Official Website: [https://sbgn.github.io/](https://sbgn.github.io/)
2. SBGN Process Description Specification: [https://sbgn.github.io/specifications](https://sbgn.github.io/specifications)
3. Le Novère, N. et al. The Systems Biology Graphical Notation. *Nature Biotechnology*, 27, 735–741 (2009)
4. Touré, V. et al. Quick tips for creating effective and impactful biological pathways using the Systems Biology Graphical Notation. *PLoS Computational Biology*, 14(2), e1005740 (2018)