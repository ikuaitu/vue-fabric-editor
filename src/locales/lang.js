const langList = ['zh', 'en', 'pt'];

/**
 * 创建语言组
 * @param zh
 * @param en
 * @param pt
 * @return {{pt, en, zh}}
 */
function group(zh, en, pt) {
  return { zh, en, pt };
}

const messageCollection = {
  templates: group('模板', 'Templates', 'Modelos'),
  elements: group('元素', 'Elements', 'Elementos'),
  background: group('背景', 'Background', 'Fundo'),
  size: group('尺寸', 'Size', 'Tamanho'),
  width: group('宽度', 'Width', 'Largura'),
  height: group('高度', 'Height', 'Altura'),
  grid: group('网格', 'Grid', 'Grid'),
  common_elements: group('基础要素', 'Common Elements', 'Elementos comuns'),
  draw_elements: group('绘制元素', 'Draw Elements', 'Elementos arrastre'),
  quick_navigation: group('快捷导航', 'Quick Navigation', 'Navegação rápida'),
  color_macthing: group('配色', 'Macthing', 'Seleção de cor'),
  background_texture: group('背景纹理', 'Background Texture', 'Textura de fundo'),
  material: group('素材', 'Material', 'Material'),
  picture: group('图片', 'picture', 'Imagem'),
  everything_is_fine: group('万事大吉', 'Everything is fine', 'Está tudo bem'),
  everything_goes_well: group('诸事顺遂', 'Everything goes well', 'Tudo vai bem'),
  cartoon: group('卡通', 'Cartoon', 'Cartoon'),
  default_size: group('预设尺寸', 'Default Size', 'Tamanho padrão'),
  empty: group('清空', 'Empty', 'Vazio'),
  keep: group('保存', 'Save', 'Salvar'),
  copy_to_clipboard: group(
    '复制到剪切板',
    'Copy to clipboard',
    'Copiar para a área de transferência'
  ),
  save_as_picture: group('保存为图片', 'Save as picture', 'Salvar como imagem'),
  save_as_svg: group('保存为SVG', 'Save as SVG', 'Salvar como SVG'),
  save_as_json: group('保存为JSON', 'Save as JSON', 'Salvar como JSON'),
  layers: group('图层', 'Layers', 'Camadas'),
  title_template: group('标题模板', 'Title Template', 'Sem título'),
  insert_svg: group('插入SVG元素', 'Insert SVG', 'Inserir SVG'),
  select_svg: group('选择SVG文件', 'Select SVG', 'Selecionar arquivo SVG'),
  please_choose: group('请选择', 'Please choose', 'Por favor, escolha'),
  string: group('字符串', 'string', 'String'),
  file: group('文件', 'file', 'Arquivo'),
  import_files: group('导入文件', 'Import files', 'Importar arquivos'),
  select_json: group('选择JSON文件', 'Select JSON', 'Selecione o arquivo JSON'),
  quick: { del: group('删除'), copy: group('复制'), lock: group('锁定') },
  flip: { x: group('水平翻转', 'flip x'), y: group('垂直翻转', 'flip y') },
  center_align: {
    centerX: group('水平居中', 'centerX'),
    center: group('水平垂直居中', 'center'),
    centerY: group('垂直居中', 'centerY'),
  },
  group_align: {
    left: group('左对齐', 'left'),
    centerX: group('水平居中对齐', 'centerX'),
    right: group('右对齐', 'right'),
    top: group('上对齐', 'top'),
    bottom: group('下对齐', 'bottom'),
    centerY: group('垂直居中对齐', 'centerY'),
    averageX: group('水平分布', 'averageX'),
    averageY: group('垂直分布', 'averageY'),
  },
  insertFile: {
    insert: group('插入', 'insert', 'insert'),
    insert_picture: group('插入图片', 'Insert picture', 'Inserir imagem'),
    insert_SVG: group('插入SVG元素', 'Insert SVG', 'Insert SVG'),
    insert_SVGStr: group('插入SVG字符', 'Insert SVG String', 'Insert SVG String'),
    insert_SVGStr_placeholder: group(
      '请输入SVG字符串',
      'Please enter SVG String',
      'Please enter SVG String'
    ),
    modal_tittle: group('请输入', 'Please enter', 'Please enter'),
    remarks: group('插入文件'),
  },
  history: { revocation: group('撤销', 'revocation'), redo: group('重做', 'redo') },
  upload_background: group('上传背景', 'Upload background', 'Carregar plano de fundo'),
  mouseMenu: {
    layer: group('图层管理', 'LayerManage', 'Gestão de camadas'),
    copy: group('复制', 'Copy', 'Copiar'),
    delete: group('删除', 'Delete', 'Eliminar'),
    group: group('组合', 'group', 'combinación'),
    unGroup: group('取消组合', 'Split', 'divida'),
    up: group('上移一层', 'up', 'up'),
    down: group('下移一层', 'down', 'down'),
    upTop: group('移到顶部', 'BringToFront', 'Traer al frente'),
    downTop: group('移到底部', 'SendToBack', 'Enviar a volver'),
    center: group('水平垂直居中', 'Center', 'centro'),
  },
  alert: {
    loading_fonts: group(
      '正在加载字体，您耐心等候...',
      'Loading fonts, please wait...',
      'Carregando fontes, aguarde...'
    ),
    loading_fonts_failed: group(
      '字体加载失败，请重试',
      'Fonts failed to load, please try again',
      'Falha ao carregar as fontes, tente novamente'
    ),
    loading_data: group('加载数据中...', 'Loading data...', 'Carregando dados...'),
    select_image: group(
      '请选择背景图片',
      'Please select a background image',
      'Por favor, selecione uma imagem de plano de fundo'
    ),
    select_file: group('请选择文件', 'Select a file', 'Selecione um arquivo'),
    copied_sucessful: group('复制成功', '复制成功', '复制成功'),
    fail_copy: group('复制失败', '复制失败', '复制失败'),
  },
  fruits: group('卡通水果', 'Fruits', 'Frutas de desenhos animados'),
  sports: group('体育', 'Sports', 'Esportes'),
  seasons: group('秋天', 'Autumn', 'Outono'),
  eletronics: group('计算机', 'Computer', 'Computador'),
  clothes: group('服饰', 'Clothes', 'Roupas'),
  flags: group('旗子', 'Flags', 'Bandeiras'),
  threes: group('树木', 'trees', 'Árvores'),
  food: group('食物', 'food', 'Comida'),
  medals: group('奖牌', 'Medals', 'Medalhas'),
  business: group('商务', 'Business', 'Negócios'),
  activity: group('活动', 'Activity', 'Atividade'),
  vintage: group('复古', 'vintage', 'vintage'),
  animals: group('动物', 'animals', 'animais'),
  hand_painted: group('手绘', 'hand painted', 'pintado à mão'),
  scenary_x: group('方案 {number}', 'Scenary {number}', 'Cena {number}'),
  color: group('颜色', 'Color', 'Cor'),
  red_book_vertical: group('红书竖版', 'Red Book - V', 'Red Book - V'),
  red_book_horizontal: group('红书横版', 'Red Book - H', 'Red Book - H'),
  phone_wallpaper: group('手机壁纸', 'Phone Wallpaper', 'Phone Wallpaper'),
  attributes: {
    font: group('字体', 'Font', 'Fonte'),
    align: group('对齐', 'Align', 'Alinhamento'),
    bold: group('加粗:', 'Bold:', 'Negrito:'),
    italic: group('斜体:', 'Italic:', 'Italico:'),
    underline: group('下划:', 'Underline:', 'Underline:'),
    stroke: group('边框', 'Stroke:', 'Stroke:'),
    swipe_up: group('上划:', 'Swipe UP:', 'Swipe UP:'),
    line_height: group('行高', 'Line height', 'Line height'),
    char_spacing: group('间距', 'Spacing', 'Espaço Char.'),
    exterior: group('外观', 'Exterior', 'Exterior'),
    angle: group('旋转', 'Angle', 'Ângulo'),
    left: group('X轴', 'Left', 'Esq'),
    top: group('Y轴', 'Top', 'Topo'),
    opacity: group('透明', 'Opacity', 'Transparência'),
    shadow: group('阴影', 'Shadow', 'Sombra'),
    blur: group('模糊', 'Blur', 'Blur'),
    offset_x: group('X轴', 'X', 'X'),
    offset_y: group('Y轴', 'Y', 'Y'),
    picture_filter: group('图片滤镜', 'Filter', 'Filtro'),
  },
  insert: group('插入', 'Insert', 'Inserir'),
  select_image: group('选择图片', 'Select image', 'Selecionar arquivo de imagem'),
};

export { langList, messageCollection };
