/**
 * 获取多边形顶点坐标
 * @param edges 变数
 * @param radius 半径
 * @returns 坐标数组
 */
const getPolygonVertices = (edges: number, radius: number) => {
  const vertices = [];
  const interiorAngle = (Math.PI * 2) / edges;
  let rotationAdjustment = -Math.PI / 2;
  if (edges % 2 === 0) {
    rotationAdjustment += interiorAngle / 2;
  }
  for (let i = 0; i < edges; i++) {
    // 画圆取顶点坐标
    const rad = i * interiorAngle + rotationAdjustment;
    vertices.push({
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
    });
  }
  return vertices;
};

export { getPolygonVertices };
