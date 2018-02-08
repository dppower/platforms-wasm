#pragma once
#include <Box2d/Dynamics/b2World.h>
#include <Box2d/Common/b2Math.h>
#include "player.h"
#include "world_bounds.h"

class World
{
public:
	World();
	~World();
	
	float tick(float time);
	void init(float player_x, float player_y);

private:
	b2World world_;
	Player player_;
	WorldBounds world_bounds_;
	float accumulated_time_;
};

