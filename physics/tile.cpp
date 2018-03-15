#include "tile.h"
#include <Box2D/Dynamics/b2Fixture.h>

Tile::Tile()
{
}


Tile::~Tile()
{
}

void Tile::init(b2Body * tile_body, TileData * data_ptr, float width, float height)
{
	render_data_ = data_ptr;

	float x = width * (render_data_->column + 0.5f);
	float y = height * (render_data_->row + 0.5f);
	b2Vec2 position(x, y);

	float hw = width / 2;
	float hh = height / 2;

	b2FixtureDef fixture_def;
	fixture_def.density = 0.0f;
	b2PolygonShape shape;

	switch (render_data_->shape) {
	case TileProperty::Shape::trapezoid:
		setTrapezoidTile(shape, position, hw, hh);
		break;
	case TileProperty::Shape::wedge:
		setWedgeTile(shape, position, hw, hh);
		break;
	case TileProperty::Shape::triangle:
		setTriangleTile(shape, position, hw, hh);
		break;
	case TileProperty::Shape::rectangle:
		setRectangleTile(shape, position, hw, hh);
		break;
	case TileProperty::Shape::square:
	default:		
		shape.SetAsBox(hw, hh, position, 0.0f);		
	}
	fixture_def.shape = &shape;

	float friction;
	switch (render_data_->material)
	{
	case TileProperty::Material::rock:
		friction = 0.4f;
		break;
	case TileProperty::Material::soil:
		friction = 0.6f;
		break;
	case TileProperty::Material::grass:
		friction = 0.5f;
		break;
	case TileProperty::Material::ice:
		friction = 0.1f;
		break;
	default:
		friction = 0.0f;
		break;
	}
	fixture_def.friction = friction;
	tile_body->CreateFixture(&fixture_def);
}

void Tile::setRectangleTile(b2PolygonShape & shape, const b2Vec2& position, float hw, float hh)
{
	float qw = 0.5 * hw;
	float qh = 0.5 * hh;

	switch (render_data_->pivot) {
	case TileProperty::Pivot::bottom_left:
		shape.SetAsBox(hw, qh, position - b2Vec2(0.0f, qh), 0.0f);
		break;
	case TileProperty::Pivot::bottom_right:
		shape.SetAsBox(qw, hh, position + b2Vec2(qw, 0.0f), 0.0f);
		break;
	case TileProperty::Pivot::top_right:
		shape.SetAsBox(hw, qh, position + b2Vec2(0.0f, qh), 0.0f);
		break;
	case TileProperty::Pivot::top_left:
		shape.SetAsBox(qw, hh, position - b2Vec2(qw, 0.0f), 0.0f);
		break;
	}
}

void Tile::setTrapezoidTile(b2PolygonShape & shape, const b2Vec2 & position, float hw, float hh)
{
	b2Vec2 p0(position.x - hw, position.y - hh);
	b2Vec2 m0(position.x, position.y - hh);
	b2Vec2 p1(position.x + hw, position.y - hh);
	b2Vec2 m1(position.x + hw, position.y);
	b2Vec2 p2(position.x + hw, position.y + hh);
	b2Vec2 m2(position.x, position.y + hh);
	b2Vec2 p3(position.x - hw, position.y + hh);
	b2Vec2 m3(position.x - hw, position.y);

	b2Vec2 points[4];

	if (render_data_->flip == TileProperty::Flip::right) {
		switch (render_data_->pivot) {
		case TileProperty::Pivot::bottom_left:
			setQuadPoints(points, p0, p1, p2, m2);
			break;
		case TileProperty::Pivot::bottom_right:
			setQuadPoints(points, p1, p2, p3, m3);
			break;
		case TileProperty::Pivot::top_right:
			setQuadPoints(points, p2, p3, p0, m0);
			break;
		case TileProperty::Pivot::top_left:
			setQuadPoints(points, p3, p0, p1, m1);
			break;
		}
	}
	else {
		switch (render_data_->pivot) {
		case TileProperty::Pivot::bottom_left:
			setQuadPoints(points, p0, m1, p2, p3);
			break;
		case TileProperty::Pivot::bottom_right:
			setQuadPoints(points, p1, m2, p3, p0);
			break;
		case TileProperty::Pivot::top_right:
			setQuadPoints(points, p2, m3, p0, p1);
			break;
		case TileProperty::Pivot::top_left:
			setQuadPoints(points, p3, m0, p1, p2);
			break;
		}
	}

	shape.Set(points, 4);
}

void Tile::setTriangleTile(b2PolygonShape & shape, const b2Vec2 & position, float hw, float hh)
{
	b2Vec2 p0(position.x - hw, position.y - hh);
	b2Vec2 p1(position.x + hw, position.y - hh);
	b2Vec2 p2(position.x + hw, position.y + hh);
	b2Vec2 p3(position.x - hw, position.y + hh);

	b2Vec2 points[3];

	switch (render_data_->pivot) {
	case TileProperty::Pivot::bottom_left:
		setTrianglePoints(points, p0, p1, p2);
		break;
	case TileProperty::Pivot::bottom_right:
		setTrianglePoints(points, p1, p2, p3);
		break;
	case TileProperty::Pivot::top_right:
		setTrianglePoints(points, p2, p3, p0);
		break;
	case TileProperty::Pivot::top_left:
		setTrianglePoints(points, p3, p0, p1);
		break;
	}

	shape.Set(points, 3);
}

void Tile::setWedgeTile(b2PolygonShape & shape, const b2Vec2 & position, float hw, float hh)
{
	b2Vec2 p0(position.x - hw, position.y - hh);
	b2Vec2 m0(position.x, position.y - hh);
	b2Vec2 p1(position.x + hw, position.y - hh);
	b2Vec2 m1(position.x + hw, position.y);
	b2Vec2 p2(position.x + hw, position.y + hh);
	b2Vec2 m2(position.x, position.y + hh);
	b2Vec2 p3(position.x - hw, position.y + hh);
	b2Vec2 m3(position.x - hw, position.y);

	b2Vec2 points[3];

	if (render_data_->flip == TileProperty::Flip::right) {
		switch (render_data_->pivot) {
		case TileProperty::Pivot::bottom_left:
			setTrianglePoints(points, p0, p1, m1);
			break;
		case TileProperty::Pivot::bottom_right:
			setTrianglePoints(points, p1, p2, m2);
			break;
		case TileProperty::Pivot::top_right:
			setTrianglePoints(points, p2, p3, m3);
			break;
		case TileProperty::Pivot::top_left:
			setTrianglePoints(points, p3, p0, m0);
			break;
		}
	}
	else {
		switch (render_data_->pivot) {
		case TileProperty::Pivot::bottom_left:
			setTrianglePoints(points, p0, m2, p3);
			break;
		case TileProperty::Pivot::bottom_right:
			setTrianglePoints(points, p1, m3, p0);
			break;
		case TileProperty::Pivot::top_right:
			setTrianglePoints(points, p2, m0, p1);
			break;
		case TileProperty::Pivot::top_left:
			setTrianglePoints(points, p3, m1, p2);
			break;
		}
	}

	shape.Set(points, 3);
}

void Tile::setTrianglePoints(b2Vec2 points[3], const b2Vec2 & p0, const b2Vec2 & p1, const b2Vec2 & p2)
{
	points[0].Set(p0.x, p0.y);
	points[1].Set(p1.x, p1.y);
	points[2].Set(p2.x, p2.y);
}

void Tile::setQuadPoints(b2Vec2 points[4], const b2Vec2 & p0, const b2Vec2 & p1, const b2Vec2 & p2, const b2Vec2 & p3)
{
	points[0].Set(p0.x, p0.y);
	points[1].Set(p1.x, p1.y);
	points[2].Set(p2.x, p2.y);
	points[3].Set(p3.x, p3.y);
}
