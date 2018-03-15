#pragma once
#include "tile_data.h"
#include <Box2D/Dynamics/b2Body.h>
#include <Box2D/Collision/Shapes/b2PolygonShape.h>

class Tile
{
public:
	Tile();
	~Tile();

	void init(b2Body* tile_body, TileData* data_ptr, float width, float height);

private:
	TileData * render_data_;
	void setRectangleTile(b2PolygonShape & shape, const b2Vec2& position, float width, float height);
	void setTrapezoidTile(b2PolygonShape & shape, const b2Vec2& position, float width, float height);
	void setTriangleTile(b2PolygonShape & shape, const b2Vec2& position, float width, float height);
	void setWedgeTile(b2PolygonShape & shape, const b2Vec2& position, float width, float height);
	void setTrianglePoints(b2Vec2 points[3], const b2Vec2& p0, const b2Vec2& p1, const b2Vec2& p2);
	void setQuadPoints(b2Vec2 points[4], const b2Vec2& p0, const b2Vec2& p1, const b2Vec2& p2, const b2Vec2& p3);
};

