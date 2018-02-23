#pragma once
#include <Box2D/Dynamics/b2World.h>
#include <Box2D/Dynamics/b2Body.h>
#include <functional>

class WorldBounds
{
public:
	WorldBounds();
	~WorldBounds();
	
	void init(b2World& world, float width, float height);

private:
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> origin;
};

