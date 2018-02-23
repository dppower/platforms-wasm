#pragma once
#include <Box2D/Dynamics/b2World.h>
#include <Box2D/Common/b2Math.h>
#include <vector>
#include "player.h"
#include "platform.h"
#include "world_bounds.h"
#include "render_data.h"

class World
{
public:
	World();
	~World();
	
	void tick(float time, bool jump, int move);
	void init(float width, float height, int data_index, int count);

private:
	b2World world_;
	Player player_;
	std::vector<Platform> platforms_;
	WorldBounds world_bounds_;
	float accumulated_time_;
};

