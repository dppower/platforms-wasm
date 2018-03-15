#pragma once
#include <Box2D/Dynamics/b2World.h>
#include <Box2D/Dynamics/b2Body.h>
#include <Box2D/Common/b2Math.h>
#include <vector>
#include "player.h"
#include "platform.h"
#include "world_bounds.h"
#include "render_data.h"
#include "contact_listener.h"
#include "input_component.h"
#include "tile.h"

class World
{
public:
	World();
	~World();
	
	void tick(float time);
	void init(float width, float height, int input_index, int data_index, 
		int platform_count, int tile_index, int tile_count, int tile_rows, int tile_columns
	);

private:
	InputComponent input_component_;
	ContactListener contact_listener_;
	b2World world_;
	Player player_;
	std::vector<Platform> platforms_;
	std::vector<Tile> tiles_;
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> tile_body_;
	WorldBounds world_bounds_;
	float accumulated_time_;
};

