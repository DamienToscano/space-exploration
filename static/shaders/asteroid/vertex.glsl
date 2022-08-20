precision highp int;

uniform bool uSecondLayer;
uniform bool uThirdLayer;
uniform vec3 uNoiseFrequency;
uniform ivec3 uOctaves;
uniform vec3 uLacunarity;
uniform vec3 uGain;
uniform float uHeight;
uniform float uRandOffset;

varying vec3 vVertex;

/* Hash function not depending of the hardware, always returning the same value */
float hash(uvec2 x) {
    uvec2 q = 1103515245U * ((x >> 1U) ^ (x.yx));
    uint n = 1103515245U * ((q.x) ^ (q.y >> 3U));
    return float(n) * (1.0 / float(0xffffffffU));
}

float noise(vec2 p) {

    // Offset the random function for variation
    p += uRandOffset;

    uvec2 ip = uvec2(floor(p));
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(mix(hash(ip), hash(ip + uvec2(1, 0)), u.x), mix(hash(ip + uvec2(0, 1)), hash(ip + uvec2(1, 1)), u.x), u.y);
    return res * res;
}

float fBm(vec2 p, int octaves, float lacunarity, float gain) {
    float freq = 1.0;
    float amp = 0.5;
    float sum = 0.;
    for(int i = 0; i < octaves; i++) {
        sum += noise(p * freq) * amp;
        freq *= lacunarity;
        amp *= gain;
    }
    return sum;
}

void main() {
    vec3 p = position;
    float f = fBm(uv * uNoiseFrequency.x, uOctaves.x, uLacunarity.x, uGain.x);

    if(uSecondLayer)
        f = fBm(vec2(uv.x * f, uv.y * f) * uNoiseFrequency.y + vec2(92.4, 0.221), uOctaves.y, uLacunarity.y, uGain.y);

    if(uThirdLayer)
        f = fBm(vec2(uv.x * f, uv.y * f) * uNoiseFrequency.z + vec2(1.4, 3.221), uOctaves.z, uLacunarity.z, uGain.z);

    p.z = f * uHeight;

    // Passing the vertex positions to the fragment shader
    vVertex = (modelViewMatrix * vec4(p, 1.)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}