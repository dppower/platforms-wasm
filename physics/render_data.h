#pragma once

struct RenderData
{
	float x;
	float y;
	float hw;
	float hh;
	float c;
	float s;
};

struct PlatformData : RenderData
{
	float start_x;
	float start_y;
	float end_x;
	float end_y;
};
