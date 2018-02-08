#pragma once
#include <Box2d/Dynamics/b2World.h>
#include <Box2d/Dynamics/b2Body.h>

class WorldBounds
{
public:
	WorldBounds();
	~WorldBounds();
	
	void init(b2World& world);

private:
	std::unique_ptr<b2Body> origin;
};

