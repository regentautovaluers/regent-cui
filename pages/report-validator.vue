<template>
	<template v-if="reportState === 'invalid'">
		<div class="flex size-full flex-col items-center justify-center px-5">
			<h1 class="mb-3 text-2xl font-semibold text-gray-600">Report Not Valid!</h1>
			<p class="px-4 py-3 text-sm text-gray-500">
				Kindly proceed with caution! The authenticity of the report provided cannot be
				validated. This may be because:
			</p>
			<ul class="list-disc text-sm text-gray-500">
				<li>It has not been produced at Regent Group.</li>
				<li>The validator service is experiencing an outage.</li>
				<li>The QR on the report has been doctored.</li>
				<li>It's lifespan of the report has reached its end.</li>
			</ul>
			<p class="py-3 text-sm text-gray-500">
				We highly advice you to urgently email us on
				<a
					href="mailto:info@regentautovaluers.co.ke"
					class="font-semibold text-gray-500 underline"
					>info@regentautovaluers.co.ke</a
				>
				or call us on
				<span class="font-semibold text-gray-500 underline">0700 000 000</span>
				with further details to help us investigate the matter.
			</p>
		</div>
	</template>
	<template v-if="reportState === 'valid'">
		<div class="flex size-full flex-col items-center justify-center px-5">
			<h1 class="mb-3 font-semibold text-gray-600">Report Valid!</h1>
			<p class="text-sm text-gray-500">
				Our systems can safely guarantee that the report you are in posession of has been
				generated at Regent Auto Valuers. This is not a guarantee that the report has not
				been electronically modified using software tools like Adobe Photoshop, GIMP, Canva,
				Blender or Figma. If you doubt the validity of the report or would like to get a
				copy of the original as per our data, kindly reach out to us!
			</p>
			<br />
			<p class="text-sm text-gray-500">
				For further questions or clarifications, kindly email us on
				<a
					href="mailto:info@regentautovaluers.co.ke"
					class="font-semibold text-gray-500 underline"
					>info@regentautovaluers.co.ke</a
				>
				or call us on
				<span class="font-semibold text-gray-500 underline">0700 000 000</span>
				with further details to help us investigate the matter.
			</p>
			<div class="mt-5 w-full rounded-md border-yellow-300 bg-yellow-100 p-3 text-yellow-800">
				<h1 class="text-sm font-semibold">Validator hash:</h1>
				<p class="text-xs">
					{{ routeQuery?.hash }}
				</p>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
	definePageMeta({
		layout: 'report-validator-layout',
		name: 'report-validator',
	});

	const { query: routeQuery } = useRoute();
	const reportState: Ref<'invalid' | 'valid'> = ref(routeQuery?.state as 'invalid' | 'valid');
</script>
