#include "world_bounds.h"
#include <Box2D/Collision/Shapes/b2PolygonShape.h>
#include <Box2D/Dynamics/b2Fixture.h>

WorldBounds::WorldBounds() :
	ground_tag_("ground")
{
}


WorldBounds::~WorldBounds()
{
}

void WorldBounds::init(b2World& world, float width, float height) {
	// Origin
	b2BodyDef originDef;
	originDef.type = b2_staticBody;
	originDef.position.Set(0.0f, 0.0f);
	origin = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&originDef),
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	b2FixtureDef fixtureDef;
	fixtureDef.density = 0.0f;
	// Ground Box	
	b2PolygonShape boundingBox;	
	boundingBox.SetAsBox(width * 1.5f, height * 0.5f, b2Vec2(width * 0.5f, height * -0.5f), 0);
	fixtureDef.shape = &boundingBox;
	fixtureDef.userData = static_cast<void*>(&ground_tag_);
	origin->CreateFixture(&fixtureDef);

	// Left Box
	boundingBox.SetAsBox(width * 0.5f, height * 0.5f, b2Vec2(width * -0.5f, height * 0.5f), 0);
	fixtureDef.shape = &boundingBox;
	fixtureDef.userData = nullptr;
	origin->CreateFixture(&fixtureDef);

	// Right Box
	boundingBox.SetAsBox(width * 0.5f, height * 0.5f, b2Vec2(width * 1.5f, height * 0.5f), 0);
	fixtureDef.shape = &boundingBox;
	fixtureDef.userData = nullptr;
	origin->CreateFixture(&fixtureDef);

	// Top Box
	boundingBox.SetAsBox(width * 1.5f, height * 0.5f, b2Vec2(width * 0.5f, height * 1.5f), 0);
	fixtureDef.shape = &boundingBox;
	fixtureDef.userData = nullptr;
	origin->CreateFixture(&fixtureDef);
}
