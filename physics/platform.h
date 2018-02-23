#pragma once
#include <Box2D/Dynamics/b2World.h>
#include <Box2D/Dynamics/b2Body.h>
#include <functional>
#include "render_data.h"

class Platform
{
public:
	Platform();
	~Platform();
	Platform(Platform&& platform);
	void init(b2World& world, RenderData* data_ptr, int index);
	void updateRenderData();

private:
	RenderData * render_data_;
	int platform_index_;
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> body_;
};

