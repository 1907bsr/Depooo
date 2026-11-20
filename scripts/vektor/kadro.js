'use strict';
// ===== Kadro: karakter görünümleri (palet + saç + aksesuar). Mary = LOOK.mary =====
mk('maid', { skin: '#ecc3a2', skinD: '#d09f7c', hair: '#7a4a2e', hairD: '#523019', hairL: '#8f5d3b', hairStyle: 'bun', acc: 'cap',
  gown: '#4b433c', gownD: '#352f2a', gownL: '#6b6258', sleeve: '#4b433c', sleeveD: '#352f2a', hand: '#ecc3a2', sashOn: false, neck: 'collar', trim: '#f6f0e2', apron: true, earrings: false, skirt: 'straight', hem: 'none', head: 1.3 });
mk('greek', { skin: '#e6bb98', skinD: '#c99f7c', hair: '#2c1b14', hairD: '#1c110c', hairL: '#4a3126', hairStyle: 'bun', acc: 'headband', accC: '#c8a043',
  gown: '#efe6d2', gownD: '#d6c8ac', gownL: '#f7f1e3', sleeve: '#e6bb98', sleeveD: '#c99f7c', hand: '#e6bb98', sash: '#c8a043', sashD: '#a07f33', neck: 'scoop', trim: '#f7f1e3', skirt: 'straight', hem: 'none', earrings: false });
mk('greek2', Object.assign({}, LOOK.greek, { gown: '#e2d2b6', gownD: '#c4b08c', gownL: '#efe3cb', hairStyle: 'bob', acc: 'none', skin: '#dcae8a', skinD: '#c0926f', sleeve: '#dcae8a', sleeveD: '#c0926f', hand: '#dcae8a' }));
mk('roman', { skin: '#e2b794', skinD: '#c79a78', hair: '#3a2219', hairD: '#24140e', hairL: '#573629', hairStyle: 'bun', acc: 'none',
  gown: '#b9683f', gownD: '#8f4c2c', gownL: '#d08a62', sleeve: '#e2b794', sleeveD: '#c79a78', hand: '#e2b794', sash: '#e8d9b0', sashD: '#bfae82', neck: 'scoop', trim: '#e8d9b0', skirt: 'straight', hem: 'none', earrings: true });
mk('vic', { skin: '#ecc5a4', skinD: '#d3a07f', hair: '#5a382b', hairD: '#3a2219', hairL: '#7b523e', hairStyle: 'bun', acc: 'none',
  gown: '#6f7b52', gownD: '#566040', gownL: '#8f9a70', sleeve: '#6f7b52', sleeveD: '#566040', hand: '#ecc5a4', sashOn: false, neck: 'collar', trim: '#f3e9d3', earrings: false, hem: 'scallop' });
mk('lady1', Object.assign({}, LOOK.vic, { gown: '#7d3c3e', gownD: '#5f2c30', gownL: '#a05a5a', sleeve: '#7d3c3e', sleeveD: '#5f2c30', hair: '#2c1b14', hairD: '#1c110c', hairL: '#4a3126' }));
mk('lady2', Object.assign({}, LOOK.vic, { gown: '#8a7d8f', gownD: '#6c6171', gownL: '#a89dac', sleeve: '#8a7d8f', sleeveD: '#6c6171', hair: '#8d8880', hairD: '#6c6862', hairL: '#a9a49c' }));
mk('lady3', Object.assign({}, LOOK.vic, { gown: '#b39349', gownD: '#8f7332', gownL: '#cfb36c', sleeve: '#b39349', sleeveD: '#8f7332', hair: '#c9a45a', hairD: '#a07f33', hairL: '#dcc07e' }));
mk('lady4', Object.assign({}, LOOK.vic, { gown: '#5f6b4a', gownD: '#475237', gownL: '#7f8c66', sleeve: '#5f6b4a', sleeveD: '#475237', hair: '#8a4a2a', hairD: '#663420', hairL: '#a86840' }));
mk('arch', { skin: '#ecc5a4', skinD: '#d3a07f', hair: '#4a3126', hairD: '#2f1d14', hairL: '#6a4636', hairStyle: 'bob', acc: 'none', glasses: true,
  gown: '#efeae0', gownD: '#d4cdbc', gownL: '#f7f4ec', sleeve: '#efeae0', sleeveD: '#d4cdbc', hand: '#e9e6dd', sashOn: false, neck: 'collar', trim: '#ffffff', skirt: 'straight', hem: 'none', earrings: false });
mk('arch2', Object.assign({}, LOOK.arch, { hair: '#8d8880', hairD: '#6c6862', hairL: '#a9a49c', hairStyle: 'bun', skin: '#e2b794', skinD: '#c79a78', browC: '#6c6862' }));
mk('medieval', { skin: '#e4bc9a', skinD: '#c89f7c', hair: '#6a4a30', hairD: '#4a3220', hairL: '#8a6240', hairStyle: 'bun', acc: 'cap',
  gown: '#8a6b4a', gownD: '#6c5238', gownL: '#a98a66', sleeve: '#d8c9a8', sleeveD: '#b9a985', hand: '#e4bc9a', sashOn: true, sash: '#6c5238', sashD: '#4a3826', neck: 'collar', trim: '#d8c9a8', skirt: 'bell', hem: 'none', earrings: false, apron: false });
mk('cadolle', { skin: '#ecc5a4', skinD: '#d3a07f', hair: '#8d8880', hairD: '#6c6862', hairL: '#a9a49c', hairStyle: 'bun', acc: 'none', glasses: true, browC: '#6c6862',
  gown: '#4d3b4a', gownD: '#382a37', gownL: '#6a5568', sleeve: '#4d3b4a', sleeveD: '#382a37', hand: '#ecc5a4', sashOn: false, neck: 'collar', trim: '#f3e9d3', skirt: 'straight', hem: 'none', earrings: false });
mk('friendA', Object.assign({}, LOOK.mary, { gown: '#b9a7c4', gownD: '#9a88a6', gownL: '#d3c5dc', hair: '#2c1b14', hairD: '#1c110c', hairL: '#4a3126', accC: '#d3c5dc', accD: '#9a88a6', sash: '#9a88a6' }));
mk('friendB', Object.assign({}, LOOK.mary, { gown: '#e0c98a', gownD: '#bda566', gownL: '#efe0b0', hair: '#c9a45a', hairD: '#a07f33', hairL: '#dcc07e', accC: '#efe0b0', accD: '#bda566', sash: '#bda566' }));
mk('friendC', Object.assign({}, LOOK.mary, { gown: '#a3b08c', gownD: '#848f6e', gownL: '#bfc9a9', hair: '#8a4a2a', hairD: '#663420', hairL: '#a86840', accC: '#bfc9a9', accD: '#848f6e', sash: '#848f6e' }));
mk('caresse', { skin: '#ecc5a4', skinD: '#d3a07f', hair: '#6a3f26', hairD: '#46281a', hairL: '#8a5a3a', hairStyle: 'bob', acc: 'cloche', accC: '#8f9c78', accD: '#6f7c5a',
  gown: '#a8b090', gownD: '#868e70', gownL: '#c3c9ae', sleeve: '#a8b090', sleeveD: '#868e70', hand: '#ecc5a4', sash: '#e8d9b0', sashD: '#bfae82', neck: 'scoop', trim: '#f3e9d3', skirt: 'mid', legs: true, stock: '#e9dbc6', earrings: true });
// 1960'lar
mk('w68a', { skin: '#ecc5a4', skinD: '#d3a07f', hair: '#6b4a30', hairD: '#4a3220', hairL: '#8a6a4a', hairStyle: 'beehive', acc: 'none',
  gown: '#d8bfa0', gownD: '#b69c7e', gownL: '#e8d5ba', sleeve: '#ecc5a4', sleeveD: '#d3a07f', hand: '#ecc5a4', sashOn: false, neck: 'collar', trim: '#f3e9d3', skirt: 'mid', legs: true, stock: '#ead9c4', shoes: '#3b2a22', earrings: true });
mk('w68b', Object.assign({}, LOOK.w68a, { gown: '#e8b9a0', gownD: '#c99880', gownL: '#f3d0bc', hair: '#3a2219', hairD: '#24140e', hairL: '#573629', hairStyle: 'long' }));
mk('w68c', Object.assign({}, LOOK.w68a, { gown: '#efe6cf', gownD: '#d2c7ad', gownL: '#f8f2e2', hair: '#d6b36a', hairD: '#b08f45', hairL: '#e6cb8c' }));
mk('w68d', Object.assign({}, LOOK.w68a, { gown: '#a6b284', gownD: '#868f66', gownL: '#c0c9a3', hair: '#4a3126', hairD: '#2f1d14', hairL: '#6a4636', hairStyle: 'bob' }));
// erkekler
mk('cop', { male: true, skin: '#e6bb98', skinD: '#c99f7c', lip: '#a4504e', hair: '#4a3126', hairD: '#2f1d14', hairL: '#6a4636', hairStyle: 'short', acc: 'police', accC: '#3d3a38', accD: '#2a2827', sash: '#c8a043',
  gown: '#3d3a38', gownD: '#2a2827', gownL: '#575350', neck: 'm', tie: '#24211f', trou: '#33302f', shoes: '#1d1a19', legs: true, earrings: false, lash: false, browW: 9, head: 1.25, jaw: 1, skirt: 'none' });
mk('wig1', { male: true, skin: '#ecc5a4', skinD: '#d3a07f', lip: '#a4504e', hair: '#f1ece4', hairD: '#d4ccbf', hairL: '#e2dccf', hairStyle: 'wig', acc: 'none',
  gown: '#7a5a3c', gownD: '#5a4028', gownL: '#98765a', neck: 'm', tie: '#f4efe3', earrings: false, lash: false, browW: 8.5, head: 1.2, jaw: 1, skirt: 'none', browC: '#cfc7b8' });
mk('wig2', Object.assign({}, LOOK.wig1, { gown: '#5f6b4a', gownD: '#475237', gownL: '#7f8c66', moustache: 'small', hair: '#e9e3d8' }));
mk('otto', { male: true, skin: '#e8c3a0', skinD: '#cfa27e', lip: '#a4504e', hair: '#3a2219', hairD: '#24140e', hairL: '#573629', hairStyle: 'short', acc: 'none', moustache: 'handlebar',
  gown: '#8a8a60', gownD: '#6c6c48', gownL: '#a6a67e', neck: 'm', tie: '#8a2f2c', earrings: false, lash: false, browW: 10, head: 1.22, jaw: 1, skirt: 'none' });
mk('reyburn', { male: true, skin: '#ecc5a4', skinD: '#d3a07f', lip: '#a4504e', hair: '#5a4632', hairD: '#3a2c1e', hairL: '#7a6244', hairStyle: 'short', acc: 'none', glasses: true,
  gown: '#8b7a5a', gownD: '#6c5e44', gownL: '#a89878', neck: 'm', tie: '#f4efe3', earrings: false, lash: false, browW: 8, head: 1.22, jaw: 1, skirt: 'none' });
mk('exec', { male: true, skin: '#e8c3a0', skinD: '#cfa27e', lip: '#a4504e', hair: '#4a4a48', hairD: '#2f2f2d', hairL: '#6a6a66', hairStyle: 'short', acc: 'none', moustache: 'thick',
  gown: '#2f2c2c', gownD: '#1e1c1c', gownL: '#4a4646', neck: 'm', tie: '#7d3c3e', earrings: false, lash: false, browW: 10, head: 1.22, jaw: 2, skirt: 'none' });
mk('quiz', { male: true, skin: '#ecc5a4', skinD: '#d3a07f', lip: '#a4504e', hair: '#c9a45a', hairD: '#a07f33', hairL: '#dcc07e', hairStyle: 'short', acc: 'none',
  gown: '#b39349', gownD: '#8f7332', gownL: '#cfb36c', neck: 'm', tie: '#f4efe3', earrings: false, lash: false, browW: 8, head: 1.25, jaw: 0, skirt: 'none' });
